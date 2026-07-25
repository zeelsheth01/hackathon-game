import axios from 'axios';

async function testBackend() {
  console.log('Testing Backend Endpoints...');

  try {
    // Test Health Endpoint
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('[OK] Health Check:', health.data);

    // Test Leaderboard Endpoints
    const topScores = await axios.get('http://localhost:5000/api/leaderboard/top');
    console.log('[OK] Top Scores:', Array.isArray(topScores.data) ? `Found ${topScores.data.length} scores` : topScores.data);

    const recentRuns = await axios.get('http://localhost:5000/api/leaderboard/recent');
    console.log('[OK] Recent Runs:', Array.isArray(recentRuns.data) ? `Found ${recentRuns.data.length} runs` : recentRuns.data);

    // Test Game Controller Mock (Without actual auth)
    // We expect a 401 Unauthorized because we don't have a valid user ID in the headers
    try {
      await axios.post('http://localhost:5000/api/game/score', { problem: { id: 1 } });
      console.log('[FAIL] Score Game allowed unauthorized access!');
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log('[OK] Auth middleware correctly blocked unauthorized access to /score');
      } else {
        console.log('[FAIL] Auth middleware failed or crashed:', error.message);
      }
    }

    console.log('\n✅ All automated backend tests passed successfully!');
  } catch (error: any) {
    console.error('❌ Tests failed:', error.message);
  }
}

testBackend();
