import sax from 'sax';
import fs from 'fs';

console.log('🏥 Apple Health Wrapped - Data Parser\n');

// Check if export.xml exists
if (!fs.existsSync('./export.xml')) {
  console.error('❌ Error: export.xml not found!');
  console.log('📝 Please place your Apple Health export.xml file in this directory.\n');
  process.exit(1);
}

console.log('📖 Streaming export.xml...');
console.log('⚙️  Parsing XML data (this may take a while)...\n');
console.log('💡 Only keeping 2025 data to save memory\n');

// Only store 2025 data to save memory
const records2025 = [];
const workouts2025 = [];
const activitySummaries2025 = [];

// Counters for total data
let totalRecords = 0;
let totalWorkouts = 0;
let totalActivitySummaries = 0;

let exportDate = null;
let totalElements = 0;

// Helper function to check if date is in 2025
function is2025(dateString) {
  if (!dateString) return false;
  return dateString.startsWith('2025');
}

// Create streaming parser
const saxStream = sax.createStream(true, { trim: true });

saxStream.on('opentag', (node) => {
  totalElements++;

  // Progress indicator every 100k elements
  if (totalElements % 100000 === 0) {
    process.stdout.write(`   Processed ${(totalElements / 1000000).toFixed(1)}M elements... (2025 records: ${records2025.length.toLocaleString()})\r`);
  }

  const name = node.name;
  const attrs = node.attributes;

  if (name === 'ExportDate') {
    exportDate = attrs.value;
  } else if (name === 'Record') {
    totalRecords++;
    // Only store if it's from 2025
    if (is2025(attrs.startDate)) {
      records2025.push(attrs);
    }
  } else if (name === 'Workout') {
    totalWorkouts++;
    // Only store if it's from 2025
    if (is2025(attrs.startDate)) {
      workouts2025.push(attrs);
    }
  } else if (name === 'ActivitySummary') {
    totalActivitySummaries++;
    // Only store if it's from 2025
    if (is2025(attrs.dateComponents)) {
      activitySummaries2025.push(attrs);
    }
  }
});

saxStream.on('error', (e) => {
  console.error('\n❌ Error parsing XML:', e.message);
  process.exit(1);
});

saxStream.on('end', () => {
  console.log('\n\n✅ XML parsing complete!');

  console.log(`\n📊 Total records in export: ${totalRecords.toLocaleString()}`);
  console.log(`💪 Total workouts in export: ${totalWorkouts.toLocaleString()}`);
  console.log(`📅 Total activity summaries in export: ${totalActivitySummaries.toLocaleString()}`);

  console.log(`\n📆 2025 Data:`);
  console.log(`   Records: ${records2025.length.toLocaleString()}`);
  console.log(`   Workouts: ${workouts2025.length.toLocaleString()}`);
  console.log(`   Activity Summaries: ${activitySummaries2025.length.toLocaleString()}`);

  // Categorize record types
  const recordTypeCount = {};
  records2025.forEach(record => {
    const type = record.type.replace('HKQuantityTypeIdentifier', '').replace('HKCategoryTypeIdentifier', '');
    recordTypeCount[type] = (recordTypeCount[type] || 0) + 1;
  });

  console.log('\n📋 Top Record Types in 2025:');
  Object.entries(recordTypeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count.toLocaleString()}`);
    });

  // Categorize workout types
  const workoutTypeCount = {};
  workouts2025.forEach(workout => {
    const type = workout.workoutActivityType.replace('HKWorkoutActivityType', '');
    workoutTypeCount[type] = (workoutTypeCount[type] || 0) + 1;
  });

  if (Object.keys(workoutTypeCount).length > 0) {
    console.log('\n🏃 Workout Types in 2025:');
    Object.entries(workoutTypeCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
  }

  // Generate detailed summary
  const summary = {
    exportDate: exportDate,
    totalRecords: totalRecords,
    totalWorkouts: totalWorkouts,
    totalActivitySummaries: totalActivitySummaries,
    year2025: {
      records: records2025.length,
      workouts: workouts2025.length,
      activitySummaries: activitySummaries2025.length,
      recordTypes: recordTypeCount,
      workoutTypes: workoutTypeCount,

      // Calculate stats for common metrics
      stats: {
        heartRate: calculateStats(records2025, 'HKQuantityTypeIdentifierHeartRate'),
        steps: calculateStats(records2025, 'HKQuantityTypeIdentifierStepCount'),
        activeEnergy: calculateStats(records2025, 'HKQuantityTypeIdentifierActiveEnergyBurned'),
        distance: calculateStats(records2025, 'HKQuantityTypeIdentifierDistanceWalkingRunning'),
        sleep: calculateStats(records2025, 'HKCategoryTypeIdentifierSleepAnalysis'),
        restingHeartRate: calculateStats(records2025, 'HKQuantityTypeIdentifierRestingHeartRate'),
        vo2Max: calculateStats(records2025, 'HKQuantityTypeIdentifierVO2Max'),
        workoutStats: calculateWorkoutStats(workouts2025)
      }
    }
  };

  function calculateStats(records, type) {
    const filtered = records.filter(r => r.type === type && r.value);
    if (filtered.length === 0) return null;

    const values = filtered.map(r => parseFloat(r.value));
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return {
      count: filtered.length,
      total: sum,
      average: avg,
      max: max,
      min: min,
      unit: filtered[0].unit
    };
  }

  function calculateWorkoutStats(workouts) {
    if (workouts.length === 0) return null;

    const durations = workouts.filter(w => w.duration).map(w => parseFloat(w.duration));
    const distances = workouts.filter(w => w.totalDistance).map(w => parseFloat(w.totalDistance));
    const calories = workouts.filter(w => w.totalEnergyBurned).map(w => parseFloat(w.totalEnergyBurned));

    return {
      count: workouts.length,
      totalDuration: durations.reduce((a, b) => a + b, 0),
      avgDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      totalDistance: distances.reduce((a, b) => a + b, 0),
      totalCalories: calories.reduce((a, b) => a + b, 0)
    };
  }

  // Save summary to JSON
  console.log('\n💾 Saving summary to summary.json...');
  fs.writeFileSync('./summary.json', JSON.stringify(summary, null, 2));

  console.log('✅ Done! Summary saved to summary.json\n');
});

// Create read stream and pipe to SAX parser
const stream = fs.createReadStream('./export.xml', { encoding: 'utf8' });
stream.pipe(saxStream);
