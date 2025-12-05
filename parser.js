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

  console.log('\n🔍 Analyzing trends and patterns...\n');

  // Categorize record types
  const recordTypeCount = {};
  records2025.forEach(record => {
    const type = record.type.replace('HKQuantityTypeIdentifier', '').replace('HKCategoryTypeIdentifier', '');
    recordTypeCount[type] = (recordTypeCount[type] || 0) + 1;
  });

  console.log('📋 Top Record Types in 2025:');
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

  // Calculate monthly breakdowns
  const monthlyData = calculateMonthlyBreakdowns(records2025, workouts2025);

  // Calculate daily aggregations for top days
  const dailyData = calculateDailyAggregations(records2025, workouts2025);

  // Calculate streaks
  const streaks = calculateStreaks(dailyData);

  // Calculate personal records
  const personalRecords = calculatePersonalRecords(records2025, workouts2025, dailyData);

  // Calculate time-based patterns
  const timePatterns = calculateTimePatterns(workouts2025, records2025);

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
      },

      // NEW: Time-based insights
      monthlyBreakdown: monthlyData,
      topDays: dailyData.topDays,
      streaks: streaks,
      personalRecords: personalRecords,
      timePatterns: timePatterns,

      // NEW: Wrapped-style insights
      wrappedInsights: generateWrappedInsights(
        records2025,
        workouts2025,
        monthlyData,
        dailyData,
        streaks,
        personalRecords,
        timePatterns
      )
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

  function calculateMonthlyBreakdowns(records, workouts) {
    const months = {};

    // Initialize all months
    for (let i = 1; i <= 12; i++) {
      const monthKey = i.toString().padStart(2, '0');
      months[monthKey] = {
        month: monthKey,
        monthName: new Date(2025, i - 1).toLocaleString('en', { month: 'long' }),
        steps: 0,
        distance: 0,
        activeEnergy: 0,
        workouts: 0,
        workoutTypes: {}
      };
    }

    // Aggregate records by month
    records.forEach(record => {
      const month = record.startDate.substring(5, 7);
      if (!months[month]) return;

      const value = parseFloat(record.value) || 0;

      if (record.type === 'HKQuantityTypeIdentifierStepCount') {
        months[month].steps += value;
      } else if (record.type === 'HKQuantityTypeIdentifierDistanceWalkingRunning') {
        months[month].distance += value;
      } else if (record.type === 'HKQuantityTypeIdentifierActiveEnergyBurned') {
        months[month].activeEnergy += value;
      }
    });

    // Aggregate workouts by month
    workouts.forEach(workout => {
      const month = workout.startDate.substring(5, 7);
      if (!months[month]) return;

      months[month].workouts++;

      const type = workout.workoutActivityType.replace('HKWorkoutActivityType', '');
      months[month].workoutTypes[type] = (months[month].workoutTypes[type] || 0) + 1;
    });

    return Object.values(months);
  }

  function calculateDailyAggregations(records, workouts) {
    const days = {};

    // Aggregate records by day
    records.forEach(record => {
      const date = record.startDate.substring(0, 10);
      if (!days[date]) {
        days[date] = {
          date,
          steps: 0,
          distance: 0,
          activeEnergy: 0,
          workouts: 0,
          heartRateMax: 0,
          heartRateAvg: []
        };
      }

      const value = parseFloat(record.value) || 0;

      if (record.type === 'HKQuantityTypeIdentifierStepCount') {
        days[date].steps += value;
      } else if (record.type === 'HKQuantityTypeIdentifierDistanceWalkingRunning') {
        days[date].distance += value;
      } else if (record.type === 'HKQuantityTypeIdentifierActiveEnergyBurned') {
        days[date].activeEnergy += value;
      } else if (record.type === 'HKQuantityTypeIdentifierHeartRate') {
        days[date].heartRateMax = Math.max(days[date].heartRateMax, value);
        days[date].heartRateAvg.push(value);
      }
    });

    // Add workout data
    workouts.forEach(workout => {
      const date = workout.startDate.substring(0, 10);
      if (days[date]) {
        days[date].workouts++;
      }
    });

    // Calculate average heart rates
    Object.values(days).forEach(day => {
      if (day.heartRateAvg.length > 0) {
        day.heartRateAvg = day.heartRateAvg.reduce((a, b) => a + b, 0) / day.heartRateAvg.length;
      } else {
        day.heartRateAvg = 0;
      }
    });

    const dailyArray = Object.values(days).sort((a, b) => b.steps - a.steps);

    return {
      allDays: days,
      topDays: {
        topStepDays: dailyArray.slice(0, 5),
        topDistanceDays: Object.values(days).sort((a, b) => b.distance - a.distance).slice(0, 5),
        topCalorieDays: Object.values(days).sort((a, b) => b.activeEnergy - a.activeEnergy).slice(0, 5)
      }
    };
  }

  function calculateStreaks(dailyData) {
    const days = Object.keys(dailyData.allDays).sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let streakStart = null;
    let longestStreakStart = null;
    let longestStreakEnd = null;
    let prevDate = null;

    days.forEach(date => {
      const day = dailyData.allDays[date];

      // Consider it an active day if they have workouts or significant steps
      const isActiveDay = day.workouts > 0 || day.steps > 3000;

      if (isActiveDay) {
        if (!prevDate || isConsecutiveDay(prevDate, date)) {
          if (currentStreak === 0) streakStart = date;
          currentStreak++;

          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
            longestStreakStart = streakStart;
            longestStreakEnd = date;
          }
        } else {
          currentStreak = 1;
          streakStart = date;
        }
        prevDate = date;
      }
    });

    return {
      longestStreak,
      longestStreakStart,
      longestStreakEnd,
      currentStreak
    };
  }

  function isConsecutiveDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  function calculatePersonalRecords(records, workouts, dailyData) {
    // Get steps records
    const stepRecords = records.filter(r => r.type === 'HKQuantityTypeIdentifierStepCount');
    const maxStepsInOneRecord = stepRecords.length > 0
      ? Math.max(...stepRecords.map(r => parseFloat(r.value)))
      : 0;

    // Get max step day from daily data
    const dailyArray = Object.values(dailyData.allDays);
    const maxStepDay = dailyArray.reduce((max, day) => day.steps > max.steps ? day : max, dailyArray[0] || {});

    // Get distance records
    const distanceRecords = records.filter(r => r.type === 'HKQuantityTypeIdentifierDistanceWalkingRunning');
    const maxDistanceInOneRecord = distanceRecords.length > 0
      ? Math.max(...distanceRecords.map(r => parseFloat(r.value)))
      : 0;

    // Workout records
    const longestWorkout = workouts.reduce((max, w) => {
      const duration = parseFloat(w.duration) || 0;
      return duration > max.duration ? { ...w, duration } : max;
    }, { duration: 0 });

    // First and last workout
    const sortedWorkouts = [...workouts].sort((a, b) =>
      new Date(a.startDate) - new Date(b.startDate)
    );

    return {
      maxStepsInOneDay: {
        steps: maxStepDay?.steps || 0,
        date: maxStepDay?.date || null
      },
      maxDistanceInOneRecord: maxDistanceInOneRecord,
      maxCaloriesInOneDay: {
        calories: dailyArray.reduce((max, day) => Math.max(max, day.activeEnergy), 0),
        date: dailyArray.reduce((max, day) => day.activeEnergy > max.activeEnergy ? day : max, dailyArray[0] || {}).date
      },
      longestWorkout: {
        duration: longestWorkout.duration,
        type: longestWorkout.workoutActivityType?.replace('HKWorkoutActivityType', ''),
        date: longestWorkout.startDate?.substring(0, 10)
      },
      firstWorkout: {
        type: sortedWorkouts[0]?.workoutActivityType?.replace('HKWorkoutActivityType', ''),
        date: sortedWorkouts[0]?.startDate?.substring(0, 10)
      },
      latestWorkout: {
        type: sortedWorkouts[sortedWorkouts.length - 1]?.workoutActivityType?.replace('HKWorkoutActivityType', ''),
        date: sortedWorkouts[sortedWorkouts.length - 1]?.startDate?.substring(0, 10)
      }
    };
  }

  function calculateTimePatterns(workouts, records) {
    const hourCounts = new Array(24).fill(0);
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    workouts.forEach(workout => {
      const date = new Date(workout.startDate);
      const hour = date.getHours();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const day = dayNames[date.getDay()];

      hourCounts[hour]++;
      dayCounts[day]++;
    });

    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    const peakDay = Object.entries(dayCounts).reduce((max, [day, count]) =>
      count > max.count ? { day, count } : max,
      { day: 'Mon', count: 0 }
    );

    return {
      peakWorkoutHour: peakHour,
      peakWorkoutDay: peakDay.day,
      hourDistribution: hourCounts,
      dayDistribution: dayCounts,
      morningPerson: peakHour >= 5 && peakHour < 12,
      nightOwl: peakHour >= 20 || peakHour < 5
    };
  }

  function generateWrappedInsights(records, workouts, monthlyData, dailyData, streaks, personalRecords, timePatterns) {
    const topWorkoutType = Object.entries(workoutTypeCount).sort((a, b) => b[1] - a[1])[0];
    const topMonth = monthlyData.reduce((max, month) =>
      month.workouts > max.workouts ? month : max,
      monthlyData[0]
    );

    const totalSteps = records
      .filter(r => r.type === 'HKQuantityTypeIdentifierStepCount')
      .reduce((sum, r) => sum + parseFloat(r.value), 0);

    const totalDistance = records
      .filter(r => r.type === 'HKQuantityTypeIdentifierDistanceWalkingRunning')
      .reduce((sum, r) => sum + parseFloat(r.value), 0);

    return {
      // Your 2025 Personality
      fitnessPersonality: topWorkoutType ? (
        topWorkoutType[0] === 'Running' ? 'Cardio King' :
        topWorkoutType[0] === 'Swimming' ? 'Water Warrior' :
        topWorkoutType[0] === 'Walking' ? 'Zen Master' :
        'Fitness Explorer'
      ) : 'Getting Started',

      // Top workout type
      topActivity: topWorkoutType ? {
        type: topWorkoutType[0],
        count: topWorkoutType[1]
      } : null,

      // Best month
      bestMonth: {
        month: topMonth.monthName,
        workouts: topMonth.workouts,
        steps: Math.round(topMonth.steps),
        distance: topMonth.distance.toFixed(2)
      },

      // Time personality
      timePersonality: timePatterns.morningPerson ? 'Morning Person' :
                       timePatterns.nightOwl ? 'Night Owl' : 'Flexible',

      // Streak info
      longestStreak: streaks.longestStreak,

      // Distance comparison
      distanceComparison: totalDistance > 1800 ? 'Singapore to Manila distance' :
                         totalDistance > 1400 ? 'Singapore to Bangkok distance' :
                         totalDistance > 1000 ? 'Across multiple countries' :
                         'Impressive journey',

      // Total heart beats (estimate)
      totalHeartBeats: Math.round(108 * 60 * 24 * 365),

      // Activity level
      activityLevel: totalSteps / 365 > 10000 ? 'Superstar' :
                     totalSteps / 365 > 7500 ? 'Active' :
                     totalSteps / 365 > 5000 ? 'Moderate' :
                     'Getting Started'
    };
  }

  // Save summary to JSON
  console.log('\n💾 Saving summary to summary.json...');
  fs.writeFileSync('./summary.json', JSON.stringify(summary, null, 2));

  console.log('✅ Done! Summary saved to summary.json\n');

  // Print some fun insights
  console.log('🎉 Your 2025 Wrapped Highlights:');
  console.log(`   Fitness Personality: ${summary.year2025.wrappedInsights.fitnessPersonality}`);
  console.log(`   Best Month: ${summary.year2025.wrappedInsights.bestMonth.month} (${summary.year2025.wrappedInsights.bestMonth.workouts} workouts)`);
  console.log(`   Time Personality: ${summary.year2025.wrappedInsights.timePersonality}`);
  console.log(`   Longest Streak: ${summary.year2025.streaks.longestStreak} days`);
  console.log(`   Peak Workout Time: ${summary.year2025.timePatterns.peakWorkoutHour}:00`);
  console.log(`   Favorite Day: ${summary.year2025.timePatterns.peakWorkoutDay}\n`);
});

// Create read stream and pipe to SAX parser
const stream = fs.createReadStream('./export.xml', { encoding: 'utf8' });
stream.pipe(saxStream);
