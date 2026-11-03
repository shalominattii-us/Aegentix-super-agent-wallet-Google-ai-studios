const http = require('http');

http.get('http://127.0.0.1:3000/api/xaman/wallet', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const w = json.wallet;
      console.log('=== XRPL WALLET RECONNAISSANCE ===');
      console.log('Account Address:     ', w.address);
      console.log('Network:             ', w.network);
      console.log('Native XRP Balance:  ', w.nativeXrpBalance, 'XRP');
      console.log('Native XRP USD Value:', '$' + w.nativeXrpUsd);
      console.log('Sequence:            ', w.sequence);
      console.log('Owner Count:         ', w.ownerCount);
      console.log('Total Trustlines:    ', w.totalTrustlines);
      console.log('Non-zero Trustlines: ', w.nonZeroTrustlines);
      console.log('Zero Trustlines:     ', w.totalTrustlines - w.nonZeroTrustlines, '(Reclaimable reserve:', w.reclaimableReserveXrp, 'XRP)');
      console.log('\n=== AVAILABLE HOLDINGS (BALANCE > 0) ===');
      const nonZero = (w.tokens || []).filter(t => !t.isZero);
      nonZero.forEach(t => {
        console.log(`- Token: ${t.symbol.padEnd(14)} Balance: ${String(t.balance).padEnd(12)} Issuer: ${t.issuer} (Limit: ${t.limit})`);
      });
      console.log('\n=== NFTS HELD ===');
      (w.nfts || []).forEach(nft => {
        console.log(`- TokenID: ${nft.tokenId} URI: ${nft.uri}`);
      });
    } catch (e) {
      console.error('Parsing error:', e);
    }
  });
}).on('error', (err) => {
  console.error('HTTP error:', err.message);
});
