import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const makeCommits = async (n) => {
  const git = simpleGit();
  
  for (let i = 0; i < n; i++) {
    // Generate a random date in the past year (365 days ago to 1 day ago)
    const daysAgo = random.int(1, 365);
    const commitDate = moment().subtract(daysAgo, 'days');
    
    // Ensure we don't create future dates
    const today = moment();
    if (commitDate.isAfter(today)) {
      console.log(`Skipping future date: ${commitDate.format('YYYY-MM-DD')}`);
      continue;
    }
    
    const dateString = commitDate.format('YYYY-MM-DD');
    const isoString = commitDate.toISOString();
    
    const data = {
      date: dateString,
      commits: i + 1,
      timestamp: isoString
    };
    
    console.log(`Creating commit ${i + 1}/${n} for: ${dateString}`);
    
    // Write data to file
    await new Promise((resolve, reject) => {
      jsonfile.writeFile(path, data, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Add and commit with proper date
    await git.add([path]);
    await git.commit(`Contribution ${i + 1} - ${dateString}`, {
      '--date': isoString
    });
    
    // Small delay to avoid overwhelming git
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  // Push all commits at once
  console.log("Pushing all commits to GitHub...");
  await git.push();
  console.log(`✅ Successfully created and pushed ${n} commits!`);
  console.log("🎉 Your GitHub contribution graph should update within 24 hours.");
};

// Start the process
const startContributions = async () => {
  try {
    console.log("🚀 Starting GitHub contribution generation...");
    console.log("📧 Using email: kirolosgeorgegaber@gmail.com");
    console.log("👤 Using username: kirolos-100");
    console.log("📅 Generating commits for the past year only (no future dates)...");
    console.log("");
    
    await makeCommits(100);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

startContributions();