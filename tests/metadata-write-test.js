// =============================================================================
// Metadata Write API Test Script
// Paste into foobar2000 WebView2 DevTools Console (F12)
// Test target: E:\OST\test\8686m\[例大祭21] Rebootment\01. so far.flac
// =============================================================================

const TEST_PATH = 'E:\\OST\\test\\8686m\\[例大祭21] Rebootment\\01. so far.flac';

// Helper
async function invoke(method, params = {}) {
  const r = await fb2k.invoke(method, params);
  console.log(`[${method}]`, JSON.stringify(r, null, 2));
  return r;
}

// ----------------------------
// Test 1: Read current metadata
// ----------------------------
async function test1_read() {
  console.log('=== Test 1: Read current metadata ===');
  return await invoke('metadata.readRaw', { path: TEST_PATH });
}

// ----------------------------
// Test 2: Write LYRICS tag (file may or may not be playing)
// ----------------------------
async function test2_writeLyrics() {
  console.log('=== Test 2: Write LYRICS tag ===');
  const r = await invoke('metadata.write', {
    path: TEST_PATH,
    tags: {
      LYRICS: '[00:00.00] Test lyrics line 1\n[00:05.00] Test lyrics line 2'
    }
  });
  // Verify write
  const verify = await invoke('metadata.readRaw', { path: TEST_PATH });
  const lyrics = verify?.data?.meta?.LYRICS || verify?.data?.meta?.lyrics || 'NOT FOUND';
  console.log('Verified LYRICS:', typeof lyrics === 'string' ? lyrics.substring(0, 80) + '...' : lyrics);
  return r;
}

// ----------------------------
// Test 3: Write COMMENT tag
// ----------------------------
async function test3_writeComment() {
  console.log('=== Test 3: Write COMMENT tag ===');
  return await invoke('metadata.write', {
    path: TEST_PATH,
    tags: {
      COMMENT: 'Test comment written by metadata.write API'
    }
  });
}

// ----------------------------
// Test 4: Remove LYRICS tag
// ----------------------------
async function test4_removeLyrics() {
  console.log('=== Test 4: Remove LYRICS tag ===');
  return await invoke('metadata.write', {
    path: TEST_PATH,
    tags: {
      LYRICS: null  // null = remove
    }
  });
}

// ----------------------------
// Test 5: Remove COMMENT tag
// ----------------------------
async function test5_removeComment() {
  console.log('=== Test 5: Remove COMMENT via removeTag ===');
  return await invoke('metadata.removeTag', {
    path: TEST_PATH,
    tags: ['COMMENT']
  });
}

// ----------------------------
// Test 6: Embed artwork (small test PNG - 1x1 red pixel)
// ----------------------------
async function test6_embedArtwork() {
  console.log('=== Test 6: Embed artwork (1x1 red PNG) ===');
  // 1x1 red pixel PNG in Base64
  const redPixelPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';
  return await invoke('metadata.embedArtwork', {
    path: TEST_PATH,
    imageData: redPixelPng,
    type: 'front'
  });
}

// ----------------------------
// Test 7: Remove embedded artwork
// ----------------------------
async function test7_removeArtwork() {
  console.log('=== Test 7: Remove embedded artwork ===');
  return await invoke('metadata.removeEmbeddedArt', {
    path: TEST_PATH,
    type: 'front'
  });
}

// ----------------------------
// Run all tests sequentially
// ----------------------------
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('Starting metadata write tests');
  console.log('Target:', TEST_PATH);
  console.log('='.repeat(60));
  
  const results = {};
  
  try { results.read       = await test1_read();           } catch(e) { results.read       = { error: e.message }; console.error('Test 1 FAILED:', e); }
  try { results.writeLyrics = await test2_writeLyrics();   } catch(e) { results.writeLyrics = { error: e.message }; console.error('Test 2 FAILED:', e); }
  try { results.writeComment = await test3_writeComment(); } catch(e) { results.writeComment = { error: e.message }; console.error('Test 3 FAILED:', e); }
  try { results.removeLyrics = await test4_removeLyrics(); } catch(e) { results.removeLyrics = { error: e.message }; console.error('Test 4 FAILED:', e); }
  try { results.removeComment = await test5_removeComment(); } catch(e) { results.removeComment = { error: e.message }; console.error('Test 5 FAILED:', e); }
  try { results.embedArt   = await test6_embedArtwork();   } catch(e) { results.embedArt   = { error: e.message }; console.error('Test 6 FAILED:', e); }
  try { results.removeArt  = await test7_removeArtwork();  } catch(e) { results.removeArt  = { error: e.message }; console.error('Test 7 FAILED:', e); }
  
  console.log('='.repeat(60));
  console.log('Test Summary:');
  for (const [name, r] of Object.entries(results)) {
    const status = r?.success ? 'PASS' : 'FAIL';
    const detail = r?.error || '';
    console.log(`  ${status} | ${name} ${detail ? '- ' + detail : ''}`);
  }
  console.log('='.repeat(60));
  
  return results;
}

// Instructions:
// 1. Play the test file in foobar2000 first (to test file-in-use scenario)
// 2. Paste this script in DevTools Console
// 3. Run: await runAllTests()
// 
// Or run individual tests:
//   await test1_read()
//   await test2_writeLyrics()
//   await test6_embedArtwork()
//   await test7_removeArtwork()

console.log('Metadata write test script loaded. Run: await runAllTests()');
