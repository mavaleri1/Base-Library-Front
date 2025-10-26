const fs = require('fs');

// Read vercel.json
const content = fs.readFileSync('vercel.json', 'utf8');
const match = content.match(/VITE_MATERIAL_NFT_CONTRACT.*?"([^"]+)"/);

if (match) {
  const addr = match[1];
  console.log('Address from vercel.json:', JSON.stringify(addr));
  console.log('Length:', addr.length);
  console.log('Expected length: 42');
  console.log('Character codes:');
  for(let i = 0; i < addr.length; i++) {
    console.log(i + ':', addr.charCodeAt(i), JSON.stringify(addr[i]));
  }
  
  // Check if it's a valid Ethereum address
  const isValid = /^0x[a-f0-9]{40}$/.test(addr);
  console.log('Is valid Ethereum address:', isValid);
  
  // Show the correct address for comparison
  const correctAddr = '0xd40cf2739e48d3eaeef60f296f70b915fdd8f3fbe';
  console.log('Correct address:', JSON.stringify(correctAddr));
  console.log('Correct address length:', correctAddr.length);
  console.log('Addresses match:', addr === correctAddr);
}
