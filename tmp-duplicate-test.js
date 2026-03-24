import { ratio } from 'fuzzball';

function normalizeVendorName(name) {
  return name.toLowerCase().trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\b(inc|llc|ltd|corp|co|company)\b/g, '')
    .trim();
}

function normalizeCanonicalVendorName(name) {
  if (!name) return '';
  return name.toLowerCase().trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\b(inc|llc|ltd|corp|co|company|systems|technologies|technology|services|service|solutions|labs|lab|communications|corporation|holdings|group)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeInvoiceId(id) {
  return id.toLowerCase().trim().replace(/[\s\-_./]/g, '');
}

function normalizeAmount(amount) {
  const cleaned = amount.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function normalizeDate(dateStr) {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function formClusters(pairs,numRows){
  const graph=Array.from({length:numRows},()=>[]);
  pairs.forEach(p=>{graph[p.rowA].push(p.rowB);graph[p.rowB].push(p.rowA);});
  const visited=new Set();
  const clusters=[];
  for(let i=0;i<numRows;i++){
    if(visited.has(i)) continue;
    const cluster=[];
    const stack=[i];
    while(stack.length){
      const node=stack.pop();
      if(!visited.has(node)){
        visited.add(node);
        cluster.push(node);
        stack.push(...graph[node]);
      }
    }
    if(cluster.length>1) clusters.push(cluster);
  }
  return clusters;
}

function analyzeDuplicates(rows) {
  const candidatePairs=[];
  for (let i=0;i<rows.length;i++) {
    for (let j=i+1;j<rows.length;j++) {
      const reasons=[];
      let confidence=0;
      const invoiceIdMatch=rows[i].normalizedInvoiceId!=='' && rows[i].normalizedInvoiceId===rows[j].normalizedInvoiceId;
      const canonicalVendorA=rows[i].normalizedCanonicalVendorName;
      const canonicalVendorB=rows[j].normalizedCanonicalVendorName;
      const vendorMatch=canonicalVendorA!=='' && canonicalVendorA===canonicalVendorB;
      const amountMatch=rows[i].normalizedAmount!==null && rows[i].normalizedAmount===rows[j].normalizedAmount;

      let closeDate=false;
      if(rows[i].normalizedDate && rows[j].normalizedDate){
        const diff=Math.abs(rows[i].normalizedDate.getTime()-rows[j].normalizedDate.getTime());
        if(diff<=7*24*60*60*1000) closeDate=true;
      }

      const fuzzyScore=ratio(rows[i].normalizedCanonicalVendorName, rows[j].normalizedCanonicalVendorName);
      const similarVendorName=!vendorMatch && fuzzyScore>=80;

      if(invoiceIdMatch){ reasons.push('Matching invoice ID'); confidence += 45; }
      if(vendorMatch){ reasons.push('Matching vendor name'); confidence += 35; }
      if(amountMatch){ reasons.push('Matching amount'); confidence += 15; }
      if(closeDate){ reasons.push('Close invoice date'); confidence += 10; }
      if(similarVendorName){ reasons.push('Similar vendor name'); confidence += Math.min(30, fuzzyScore/100*30); }
      if(confidence <= 0) continue;

      const candidate = { rowA:i, rowB:j, confidence:Math.min(95, confidence), reasons, isApprovedEdge:false };
      const matchesApprovedEdge = invoiceIdMatch || (vendorMatch && amountMatch) || (similarVendorName && amountMatch && closeDate);
      if(matchesApprovedEdge) candidate.isApprovedEdge = true;
      candidatePairs.push(candidate);
    }
  }

  const approvedEdges = candidatePairs.filter(p => p.isApprovedEdge);
  const clusters = formClusters(approvedEdges, rows.length);
  const allClusters = clusters.map((rowIds,index) => {
    const clusterPairs = approvedEdges.filter(p => rowIds.includes(p.rowA) && rowIds.includes(p.rowB));
    const avgConfidence = clusterPairs.reduce((sum,p)=>sum+p.confidence,0)/clusterPairs.length;
    const allReasons = Array.from(new Set(clusterPairs.flatMap(p=>p.reasons)));
    return {
      id:`DQ-${String(index+1).padStart(3,'0')}`,
      rowIds,
      confidence:Math.min(95, avgConfidence||0),
      reasons: allReasons,
    };
  });
  return allClusters.filter(c=>c.confidence>=60);
}

const input=[
  {vendor:'Adobe Systems', invoiceId:'A1', amount:'100', date:'2024-01-01'},
  {vendor:'Adobe', invoiceId:'A2', amount:'100', date:'2024-01-03'},
  {vendor:'Adobe Inc', invoiceId:'A3', amount:'100', date:'2024-01-06'},
  {vendor:'Acme Corp', invoiceId:'B1', amount:'100', date:'2024-01-03'},
];

const normalized=input.map(r=>({original:r, normalizedInvoiceId:normalizeInvoiceId(r.invoiceId), normalizedVendorName:normalizeVendorName(r.vendor), normalizedCanonicalVendorName:normalizeCanonicalVendorName(r.vendor), normalizedAmount:normalizeAmount(r.amount), normalizedDate:normalizeDate(r.date)}));
console.log('normalized', normalized.map(r=>({vendor:r.original.vendor, canonical:r.normalizedCanonicalVendorName}))); 
const clusters=analyzeDuplicates(normalized);
console.log('clusters', clusters);
