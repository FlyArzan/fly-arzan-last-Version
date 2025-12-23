// Schema Verification Script
// Run this in browser console to check if schemas are loaded

function verifySchemas() {
  console.log('🔍 Checking for Schema Markup...\n');
  
  // Find all JSON-LD scripts
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  
  if (jsonLdScripts.length === 0) {
    console.log('❌ No schema markup found!');
    return;
  }
  
  console.log(`✅ Found ${jsonLdScripts.length} schema(s):\n`);
  
  jsonLdScripts.forEach((script, index) => {
    try {
      const schema = JSON.parse(script.textContent);
      console.log(`📋 Schema ${index + 1}:`);
      console.log(`   Type: ${schema['@type']}`);
      console.log(`   Context: ${schema['@context']}`);
      
      if (schema.name) console.log(`   Name: ${schema.name}`);
      if (schema.url) console.log(`   URL: ${schema.url}`);
      
      console.log('   Full Schema:', schema);
      console.log('---\n');
      
    } catch (error) {
      console.log(`❌ Schema ${index + 1} has invalid JSON:`, error);
    }
  });
  
  // Validate required fields
  console.log('🔧 Validation Tips:');
  console.log('• Test with: https://search.google.com/test/rich-results');
  console.log('• Validate with: https://validator.schema.org/');
  console.log('• Check Google Search Console for rich snippets');
}

// Auto-run verification
verifySchemas();

// Make function available globally
window.verifySchemas = verifySchemas;
