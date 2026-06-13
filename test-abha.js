// Quick test for ABHA API
async function testABHA() {
  try {
    const response = await fetch('http://localhost:3000/api/abha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', age: 30, village: 'Test Village' })
    });
    
    const data = await response.json();
    console.log('ABHA API Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ ABHA ID Generated:', data.patient.abhaId);
    } else {
      console.log('\n❌ ABHA Generation Failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testABHA();
