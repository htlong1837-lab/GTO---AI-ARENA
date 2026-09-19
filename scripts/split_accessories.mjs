import fs from 'fs';

globalThis.self = globalThis;
globalThis.window = globalThis;
globalThis.document = { createElement: () => ({}) };

const { GLTFLoader } = await import('../node_modules/three/examples/jsm/loaders/GLTFLoader.js');
const { MeshoptDecoder } = await import('../node_modules/three/examples/jsm/libs/meshopt_decoder.module.js');

const rawBuf = fs.readFileSync('public/models/8_phu_kien.glb');
const chunk0Length = rawBuf.readUInt32LE(12);
const srcGltf = JSON.parse(rawBuf.toString('utf8', 20, 20 + chunk0Length));
const binOffset = 20 + chunk0Length + 8;

// Extract the 3 images from original GLB
const img0Data = rawBuf.subarray(binOffset + srcGltf.bufferViews[0].byteOffset, binOffset + srcGltf.bufferViews[0].byteOffset + srcGltf.bufferViews[0].byteLength);
const img1Data = rawBuf.subarray(binOffset + srcGltf.bufferViews[1].byteOffset, binOffset + srcGltf.bufferViews[1].byteOffset + srcGltf.bufferViews[1].byteLength);
const img2Data = rawBuf.subarray(binOffset + srcGltf.bufferViews[2].byteOffset, binOffset + srcGltf.bufferViews[2].byteOffset + srcGltf.bufferViews[2].byteLength);

console.log('Image sizes:', img0Data.length, img1Data.length, img2Data.length);

// Decode geometry using GLTFLoader
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

loader.parse(rawBuf.buffer.slice(rawBuf.byteOffset, rawBuf.byteOffset + rawBuf.byteLength), '', (gltf) => {
  let originalMesh;
  gltf.scene.traverse((n) => { if (n.isMesh) originalMesh = n; });
  const geom = originalMesh.geometry;
  const posAttr = geom.attributes.position;
  const normAttr = geom.attributes.normal;
  const uvAttr = geom.attributes.uv;
  const indexAttr = geom.index;

  const N = posAttr.count;
  const parent = new Int32Array(N);
  for (let i = 0; i < N; i++) parent[i] = i;
  function find(i) {
    let r = i;
    while (r !== parent[r]) r = parent[r];
    let curr = i;
    while (curr !== r) {
      const nxt = parent[curr];
      parent[curr] = r;
      curr = nxt;
    }
    return r;
  }
  function union(i, j) {
    const ri = find(i);
    const rj = find(j);
    if (ri !== rj) parent[ri] = rj;
  }
  const indices = indexAttr.array;
  for (let i = 0; i < indices.length; i += 3) {
    union(indices[i], indices[i + 1]);
    union(indices[i + 1], indices[i + 2]);
  }

  const compMap = new Map();
  for (let i = 0; i < N; i++) {
    const root = find(i);
    if (!compMap.has(root)) compMap.set(root, []);
    compMap.get(root).push(i);
  }

  const comps = [];
  for (const [root, vIndices] of compMap.entries()) {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const vi of vIndices) {
      const x = posAttr.getX(vi), y = posAttr.getY(vi), z = posAttr.getZ(vi);
      if (x < minX) minX = x; if (y < minY) minY = y; if (z < minZ) minZ = z;
      if (x > maxX) maxX = x; if (y > maxY) maxY = y; if (z > maxZ) maxZ = z;
    }
    comps.push({
      root,
      vIndices,
      count: vIndices.length,
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ]
    });
  }

  function bboxDist(a, b) {
    const dx = Math.max(0, Math.max(a.min[0] - b.max[0], b.min[0] - a.max[0]));
    const dy = Math.max(0, Math.max(a.min[1] - b.max[1], b.min[1] - a.max[1]));
    const dz = Math.max(0, Math.max(a.min[2] - b.max[2], b.min[2] - a.max[2]));
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  const clusterParent = new Int32Array(comps.length);
  for (let i = 0; i < comps.length; i++) clusterParent[i] = i;
  function cFind(i) {
    let r = i;
    while (r !== clusterParent[r]) r = clusterParent[r];
    let curr = i;
    while (curr !== r) {
      const nxt = clusterParent[curr];
      clusterParent[curr] = r;
      curr = nxt;
    }
    return r;
  }
  function cUnion(i, j) {
    const ri = cFind(i);
    const rj = cFind(j);
    if (ri !== rj) clusterParent[ri] = rj;
  }

  for (let i = 0; i < comps.length; i++) {
    for (let j = i + 1; j < comps.length; j++) {
      if (bboxDist(comps[i], comps[j]) <= 0.02) {
        cUnion(i, j);
      }
    }
  }

  const clusters = new Map();
  for (let i = 0; i < comps.length; i++) {
    const r = cFind(i);
    if (!clusters.has(r)) clusters.set(r, []);
    clusters.get(r).push(comps[i]);
  }

  const clusterList = [];
  for (const [_r, compList] of clusters.entries()) {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    const vertexSet = new Set();
    for (const c of compList) {
      for (const vi of c.vIndices) vertexSet.add(vi);
      if (c.min[0] < minX) minX = c.min[0];
      if (c.min[1] < minY) minY = c.min[1];
      if (c.min[2] < minZ) minZ = c.min[2];
      if (c.max[0] > maxX) maxX = c.max[0];
      if (c.max[1] > maxY) maxY = c.max[1];
      if (c.max[2] > maxZ) maxZ = c.max[2];
    }
    clusterList.push({
      center: [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2],
      size: [maxX - minX, maxY - minY, maxZ - minZ],
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
      vertexSet
    });
  }

  clusterList.sort((a, b) => a.center[2] - b.center[2] || a.center[0] - b.center[0]);

  function pad4(n) {
    const rem = n % 4;
    return rem === 0 ? 0 : 4 - rem;
  }

  // Generate 8 GLBs
  clusterList.forEach((cluster, clusterIdx) => {
    const vMap = new Map();
    const subPositions = [];
    const subNormals = [];
    const subUVs = [];
    const subIndices = [];

    // Collect faces belonging to this cluster
    for (let f = 0; f < indices.length; f += 3) {
      const i0 = indices[f];
      const i1 = indices[f + 1];
      const i2 = indices[f + 2];
      if (cluster.vertexSet.has(i0)) {
        for (const origIdx of [i0, i1, i2]) {
          if (!vMap.has(origIdx)) {
            const newIdx = vMap.size;
            vMap.set(origIdx, newIdx);
            // Center in X and Z, rest bottom at Y=0
            const px = posAttr.getX(origIdx) - cluster.center[0];
            const py = posAttr.getY(origIdx) - cluster.min[1];
            const pz = posAttr.getZ(origIdx) - cluster.center[2];
            subPositions.push(px, py, pz);
            subNormals.push(normAttr.getX(origIdx), normAttr.getY(origIdx), normAttr.getZ(origIdx));
            subUVs.push(uvAttr.getX(origIdx), uvAttr.getY(origIdx));
          }
          subIndices.push(vMap.get(origIdx));
        }
      }
    }

    const posArray = new Float32Array(subPositions);
    const normArray = new Float32Array(subNormals);
    const uvArray = new Float32Array(subUVs);
    const idxArray = new Uint32Array(subIndices);

    // Compute min/max of posArray
    const posMin = [Infinity, Infinity, Infinity];
    const posMax = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < posArray.length; i += 3) {
      if (posArray[i] < posMin[0]) posMin[0] = posArray[i];
      if (posArray[i+1] < posMin[1]) posMin[1] = posArray[i+1];
      if (posArray[i+2] < posMin[2]) posMin[2] = posArray[i+2];
      if (posArray[i] > posMax[0]) posMax[0] = posArray[i];
      if (posArray[i+1] > posMax[1]) posMax[1] = posArray[i+1];
      if (posArray[i+2] > posMax[2]) posMax[2] = posArray[i+2];
    }

    // Assemble binary chunk
    const buffersToConcat = [];
    const bufferViews = [];
    let currentByteOffset = 0;

    function addBufferView(data, target, byteStride) {
      const padding = pad4(currentByteOffset);
      if (padding > 0) {
        buffersToConcat.push(Buffer.alloc(padding));
        currentByteOffset += padding;
      }
      const bv = {
        buffer: 0,
        byteOffset: currentByteOffset,
        byteLength: data.byteLength
      };
      if (target) bv.target = target;
      if (byteStride) bv.byteStride = byteStride;
      bufferViews.push(bv);
      buffersToConcat.push(Buffer.from(data.buffer, data.byteOffset, data.byteLength));
      currentByteOffset += data.byteLength;
      return bufferViews.length - 1;
    }

    // bv 0: image 0 (color)
    const bvImg0 = addBufferView(img0Data);
    // bv 1: image 1 (orm)
    const bvImg1 = addBufferView(img1Data);
    // bv 2: image 2 (normal)
    const bvImg2 = addBufferView(img2Data);

    // bv 3: position (target ARRAY_BUFFER = 34962)
    const bvPos = addBufferView(posArray, 34962, 12);
    // bv 4: normal (target ARRAY_BUFFER = 34962)
    const bvNorm = addBufferView(normArray, 34962, 12);
    // bv 5: uv (target ARRAY_BUFFER = 34962)
    const bvUV = addBufferView(uvArray, 34962, 8);
    // bv 6: index (target ELEMENT_ARRAY_BUFFER = 34963)
    const bvIdx = addBufferView(idxArray, 34963);

    // Ensure BIN chunk total length is 4-byte aligned
    const finalPadding = pad4(currentByteOffset);
    if (finalPadding > 0) {
      buffersToConcat.push(Buffer.alloc(finalPadding));
      currentByteOffset += finalPadding;
    }
    const binChunkData = Buffer.concat(buffersToConcat);

    const gltfJson = {
      asset: { version: '2.0', generator: 'GTO-Antigravity-Splitter' },
      scenes: [{ nodes: [0] }],
      scene: 0,
      nodes: [{ mesh: 0, name: `PhuKien_${clusterIdx + 1}` }],
      materials: [
        {
          name: 'PBR_Material',
          pbrMetallicRoughness: {
            baseColorTexture: { index: 0 },
            metallicRoughnessTexture: { index: 1 }
          },
          normalTexture: { index: 2 }
        }
      ],
      textures: [{ source: 0 }, { source: 1 }, { source: 2 }],
      images: [
        { bufferView: bvImg0, mimeType: 'image/jpeg' },
        { bufferView: bvImg1, mimeType: 'image/jpeg' },
        { bufferView: bvImg2, mimeType: 'image/png' }
      ],
      meshes: [
        {
          name: `Mesh_${clusterIdx + 1}`,
          primitives: [
            {
              attributes: {
                POSITION: 0,
                NORMAL: 1,
                TEXCOORD_0: 2
              },
              indices: 3,
              material: 0
            }
          ]
        }
      ],
      accessors: [
        {
          bufferView: bvPos,
          byteOffset: 0,
          componentType: 5126, // FLOAT
          count: posArray.length / 3,
          type: 'VEC3',
          min: posMin,
          max: posMax
        },
        {
          bufferView: bvNorm,
          byteOffset: 0,
          componentType: 5126,
          count: normArray.length / 3,
          type: 'VEC3'
        },
        {
          bufferView: bvUV,
          byteOffset: 0,
          componentType: 5126,
          count: uvArray.length / 2,
          type: 'VEC2'
        },
        {
          bufferView: bvIdx,
          byteOffset: 0,
          componentType: 5125, // UNSIGNED_INT
          count: idxArray.length,
          type: 'SCALAR'
        }
      ],
      bufferViews,
      buffers: [{ byteLength: binChunkData.length }]
    };

    let jsonStr = JSON.stringify(gltfJson);
    const jsonPad = pad4(Buffer.byteLength(jsonStr, 'utf8'));
    if (jsonPad > 0) {
      jsonStr += ' '.repeat(jsonPad);
    }
    const jsonBuf = Buffer.from(jsonStr, 'utf8');

    // Total GLB = 12 header + (8 + jsonLen) + (8 + binLen)
    const totalLength = 12 + 8 + jsonBuf.length + 8 + binChunkData.length;
    const glbHeader = Buffer.alloc(12);
    glbHeader.write('glTF', 0, 4, 'ascii');
    glbHeader.writeUInt32LE(2, 4);
    glbHeader.writeUInt32LE(totalLength, 8);

    const chunk0Header = Buffer.alloc(8);
    chunk0Header.writeUInt32LE(jsonBuf.length, 0);
    chunk0Header.write('JSON', 4, 4, 'ascii');

    const chunk1Header = Buffer.alloc(8);
    chunk1Header.writeUInt32LE(binChunkData.length, 0);
    chunk1Header.write('BIN\0', 4, 4, 'ascii');

    const finalGLB = Buffer.concat([glbHeader, chunk0Header, jsonBuf, chunk1Header, binChunkData]);
    const outPath = `public/models/phu_kien_${clusterIdx + 1}.glb`;
    fs.writeFileSync(outPath, finalGLB);
    console.log(`Generated ${outPath} (Size: ${(finalGLB.length / 1024 / 1024).toFixed(2)} MB, Vertices: ${posArray.length / 3}, Faces: ${idxArray.length / 3})`);
  });
});
