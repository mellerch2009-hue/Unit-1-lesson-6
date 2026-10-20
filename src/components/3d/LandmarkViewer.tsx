import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Volume2, RotateCcw, Eye, Compass, ChevronDown, ChevronUp, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { speakEnglish } from '../../utils/audio';

export type LandmarkModelKey = 'london-eye' | 'tower-bridge' | 'taj-mahal' | 'palace';

interface LandmarkViewerProps {
  modelKey: LandmarkModelKey;
  onModelChange?: (key: LandmarkModelKey) => void;
  className?: string;
}

interface LandmarkInfo {
  name: string;
  nameArabic: string;
  country: 'England' | 'India';
  countryEmoji: string;
  tagline: string;
  taglineArabic: string;
  facts: { label: string; labelArabic: string; text: string; textArabic: string }[];
}

const LANDMARK_METADATA: Record<LandmarkModelKey, LandmarkInfo> = {
  'london-eye': {
    name: 'The London Eye',
    nameArabic: 'عين لندن (العجلة الدوارة)',
    country: 'England',
    countryEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    tagline: 'A very big wheel in London, England!',
    taglineArabic: 'عجلة دوارة ضخمة جداً في لندن بإنجلترا!',
    facts: [
      {
        label: 'Wheel Type',
        labelArabic: 'نوع العجلة',
        text: 'The London Eye is a very big wheel on the River Thames.',
        textArabic: 'عين لندن هي عجلة دوارة عملاقة على نهر التايمز.',
      },
      {
        label: 'Passenger Capsules',
        labelArabic: 'كبسولات الركاب',
        text: 'It carries 32 high-tech glass passenger capsules.',
        textArabic: 'تحمل 32 كبسولة زجاجية متطورة للركاب.',
      },
      {
        label: 'View',
        labelArabic: 'الإطلالة',
        text: 'From the top, you can see the whole city of London!',
        textArabic: 'من الأعلى، يمكنك رؤية مدينة لندن بالكامل!',
      },
    ],
  },
  'tower-bridge': {
    name: 'Tower Bridge',
    nameArabic: 'جسر البرج (تاور بريدج)',
    country: 'England',
    countryEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    tagline: 'A very old bridge across the River Thames!',
    taglineArabic: 'جسر قديم جداً يمر فوق نهر التايمز في لندن!',
    facts: [
      {
        label: 'Structure',
        labelArabic: 'الهيكل',
        text: 'Tower Bridge has two historic towers and high walkways.',
        textArabic: 'يتكون جسر البرج من برجين تاريخيين وممرات علوية للمشاة.',
      },
      {
        label: 'Opening Bridge',
        labelArabic: 'جسر متحرك',
        text: 'The middle of the bridge lifts open for tall ships to pass.',
        textArabic: 'يفتح وسط الجسر للأعلى لتمر السفن الكبيرة في النهر.',
      },
      {
        label: 'History',
        labelArabic: 'تاريخه',
        text: 'It was built in 1894 and is iconic to London.',
        textArabic: 'بُني عام 1894 وهو من أشهر معالم لندن في العالم.',
      },
    ],
  },
  'taj-mahal': {
    name: 'The Taj Mahal',
    nameArabic: 'قصر تاج محل',
    country: 'India',
    countryEmoji: '🇮🇳',
    tagline: 'The world-famous ivory marble jewel of India!',
    taglineArabic: 'جوهرة الهند الشهيرة عالمياً المصنوعة من الرخام الأبيض!',
    facts: [
      {
        label: 'Material',
        labelArabic: 'مادة البناء',
        text: 'Built from pure white ivory marble that shines in the sun.',
        textArabic: 'مبني من الرخام الأبيض الصافي الذي يتلألأ تحت أشعة الشمس.',
      },
      {
        label: 'Minarets',
        labelArabic: 'المآذن',
        text: 'Four tall, elegant corner minarets frame the central dome.',
        textArabic: 'أربع مآذن شاهقة تحيط بالقبة المركزية الجميلة.',
      },
      {
        label: 'Wonder of World',
        labelArabic: 'عجائب العالم',
        text: 'It is celebrated worldwide for its symmetry and beauty.',
        textArabic: 'يُصنف من أهم عجائب العالم بفضل هندسته المتناسقة وجماله.',
      },
    ],
  },
  'palace': {
    name: "The Queen's Palace",
    nameArabic: 'قصر الملكة (باكنغهام)',
    country: 'England',
    countryEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    tagline: 'The famous palace where the Queen lives in London!',
    taglineArabic: 'القصر الشهير حيث تعيش الملكة في لندن!',
    facts: [
      {
        label: 'Residence',
        labelArabic: 'مقر الإقامة',
        text: 'The palace is the royal home of the British Monarch.',
        textArabic: 'القصر هو المقر الملكي التاريخي للعرش البريطاني.',
      },
      {
        label: 'Royal Gates',
        labelArabic: 'البوابات الملكية',
        text: 'It features magnificent black and gold gates with royal crests.',
        textArabic: 'يتميز ببوابات ملكية سوداء وذهبية رائعة تحمل الشعار الملكي.',
      },
      {
        label: 'Guards',
        labelArabic: 'الحراس',
        text: 'The royal guards wear famous red coats and tall black hats.',
        textArabic: 'يرتدي الحراس الملكيون سترات حمراء شهيرة وقبعات سوداء طويلة.',
      },
    ],
  },
};

export const LandmarkViewer: React.FC<LandmarkViewerProps> = ({
  modelKey,
  onModelChange,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeModel, setActiveModel] = useState<LandmarkModelKey>(modelKey);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [activeFactIdx, setActiveFactIdx] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewAngle, setViewAngle] = useState<'orbit' | 'front' | 'top'>('orbit');

  // Sync prop changes
  useEffect(() => {
    setActiveModel(modelKey);
  }, [modelKey]);

  // Keep references for Three.js scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationYRef = useRef<number>(0);
  const isPointerDownRef = useRef(false);
  const prevPointerXRef = useRef(0);
  const prevPointerYRef = useRef(0);
  const cameraPitchRef = useRef(0.25);
  const cameraDistanceRef = useRef(14);
  const targetDistanceRef = useRef(14);

  const currentInfo = LANDMARK_METADATA[activeModel];

  // Helper to construct London Eye procedural model
  const buildLondonEye = (): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'LondonEye';

    // 1. River Thames & Circular Embankment Base
    const groundGeo = new THREE.CylinderGeometry(8.5, 9, 0.4, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x224255,
      roughness: 0.2,
      metalness: 0.6,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    group.add(ground);

    // Embankment stone rim
    const rimGeo = new THREE.TorusGeometry(8.5, 0.25, 12, 48);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const stoneRim = new THREE.Mesh(rimGeo, rimMat);
    stoneRim.rotation.x = Math.PI / 2;
    stoneRim.position.y = 0.05;
    group.add(stoneRim);

    // Boarding pier
    const pierGeo = new THREE.BoxGeometry(4, 0.3, 3);
    const pierMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    const pier = new THREE.Mesh(pierGeo, pierMat);
    pier.position.set(0, 0.15, 2.5);
    pier.receiveShadow = true;
    group.add(pier);

    // 2. Dual A-frame structural support trusses
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.3,
      metalness: 0.7,
    });
    const legGeo = new THREE.CylinderGeometry(0.18, 0.25, 7.5, 12);

    const legLeft = new THREE.Mesh(legGeo, trussMat);
    legLeft.position.set(-2, 3.5, 0.8);
    legLeft.rotation.z = 0.28;
    legLeft.rotation.x = -0.15;
    legLeft.castShadow = true;
    group.add(legLeft);

    const legRight = new THREE.Mesh(legGeo, trussMat);
    legRight.position.set(2, 3.5, 0.8);
    legRight.rotation.z = -0.28;
    legRight.rotation.x = -0.15;
    legRight.castShadow = true;
    group.add(legRight);

    // Back tension anchor cables
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });
    const backCableGeo = new THREE.CylinderGeometry(0.06, 0.06, 8, 8);
    const backCable1 = new THREE.Mesh(backCableGeo, cableMat);
    backCable1.position.set(-1.8, 3.2, -2.5);
    backCable1.rotation.x = 0.55;
    backCable1.rotation.z = -0.15;
    group.add(backCable1);

    const backCable2 = new THREE.Mesh(backCableGeo, cableMat);
    backCable2.position.set(1.8, 3.2, -2.5);
    backCable2.rotation.x = 0.55;
    backCable2.rotation.z = 0.15;
    group.add(backCable2);

    // 3. Central spindle hub
    const hubGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 24);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.position.set(0, 6.8, 0);
    hub.rotation.x = Math.PI / 2;
    group.add(hub);

    // 4. Rotating Wheel Structure (Group that spins)
    const wheelGroup = new THREE.Group();
    wheelGroup.name = 'WheelSpinner';
    wheelGroup.position.set(0, 6.8, 0);

    // Outer and Inner tension rings
    const outerRingGeo = new THREE.TorusGeometry(5.0, 0.09, 12, 64);
    const innerRingGeo = new THREE.TorusGeometry(4.2, 0.06, 12, 64);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.25 });

    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    outerRing.castShadow = true;
    innerRing.castShadow = true;
    wheelGroup.add(outerRing);
    wheelGroup.add(innerRing);

    // Radial spokes
    const spokeCount = 16;
    const spokeGeo = new THREE.CylinderGeometry(0.02, 0.02, 4.95, 6);
    const capsuleMat = new THREE.MeshPhysicalMaterial({
      color: 0xecfeff,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      thickness: 0.5,
      clearcoat: 1.0,
    });
    const capFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.7, roughness: 0.3 });

    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const spoke = new THREE.Mesh(spokeGeo, cableMat);
      spoke.position.set(Math.cos(angle) * 2.45, Math.sin(angle) * 2.45, 0);
      spoke.rotation.z = angle - Math.PI / 2;
      wheelGroup.add(spoke);

      // Passenger capsules placed around perimeter
      const capGroup = new THREE.Group();
      capGroup.name = `Capsule_${i}`;
      capGroup.position.set(Math.cos(angle) * 5.0, Math.sin(angle) * 5.0, 0);

      // Capsule glass egg
      const glassEgg = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), capsuleMat);
      glassEgg.scale.set(1.4, 0.85, 0.85);
      capGroup.add(glassEgg);

      // Capsule white outer ring frame
      const frameRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.03, 8, 24), capFrameMat);
      capGroup.add(frameRing);

      wheelGroup.add(capGroup);
    }

    group.add(wheelGroup);
    return group;
  };

  // Helper to construct Tower Bridge procedural model
  const buildTowerBridge = (): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'TowerBridge';

    // Thames River Blue Base
    const riverGeo = new THREE.PlaneGeometry(24, 14);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.15,
      metalness: 0.7,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.y = 0;
    river.receiveShadow = true;
    group.add(river);

    // Shared materials
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xd6cbb8,
      roughness: 0.85,
      metalness: 0.1,
    });
    const bridgeBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.35,
      metalness: 0.65,
    });
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

    // Function to build a single Victorian Gothic Tower
    const buildTower = (xPos: number) => {
      const towerGroup = new THREE.Group();
      towerGroup.position.set(xPos, 0, 0);

      // Pier foundation in river
      const pierGeo = new THREE.BoxGeometry(2.4, 1.2, 4.2);
      const pier = new THREE.Mesh(pierGeo, stoneMat);
      pier.position.y = 0.6;
      pier.castShadow = true;
      pier.receiveShadow = true;
      towerGroup.add(pier);

      // Lower Tower body
      const lowerBodyGeo = new THREE.BoxGeometry(2.0, 3.8, 3.2);
      const lowerBody = new THREE.Mesh(lowerBodyGeo, stoneMat);
      lowerBody.position.y = 3.1;
      lowerBody.castShadow = true;
      towerGroup.add(lowerBody);

      // Mid archway cutout (decorative dark inset)
      const archInset = new THREE.Mesh(
        new THREE.BoxGeometry(2.05, 2.2, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
      );
      archInset.position.y = 2.4;
      towerGroup.add(archInset);

      // Upper Tower body
      const upperBodyGeo = new THREE.BoxGeometry(1.8, 2.6, 2.8);
      const upperBody = new THREE.Mesh(upperBodyGeo, stoneMat);
      upperBody.position.y = 6.2;
      upperBody.castShadow = true;
      towerGroup.add(upperBody);

      // 4 Corner Turrets on Tower
      const turretPositions = [
        [-0.9, 7.5, -1.3],
        [0.9, 7.5, -1.3],
        [-0.9, 7.5, 1.3],
        [0.9, 7.5, 1.3],
      ];
      turretPositions.forEach(([tx, ty, tz]) => {
        const turretSpire = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.5, 8), stoneMat);
        turretSpire.position.set(tx, ty, tz);
        turretSpire.castShadow = true;
        towerGroup.add(turretSpire);

        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), goldMat);
        finial.position.set(tx, ty + 0.8, tz);
        towerGroup.add(finial);
      });

      // Roof pediment
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.4, 4), stoneMat);
      roof.position.y = 8.1;
      roof.rotation.y = Math.PI / 4;
      towerGroup.add(roof);

      return towerGroup;
    };

    // Twin Towers
    const towerDist = 3.8;
    group.add(buildTower(-towerDist));
    group.add(buildTower(towerDist));

    // High Walkways (Upper Bridges connecting towers)
    const upperWalkwayGeo = new THREE.BoxGeometry(towerDist * 2, 0.45, 0.6);
    const walkway1 = new THREE.Mesh(upperWalkwayGeo, bridgeBlueMat);
    walkway1.position.set(0, 6.8, -0.9);
    walkway1.castShadow = true;
    group.add(walkway1);

    const walkway2 = new THREE.Mesh(upperWalkwayGeo, bridgeBlueMat);
    walkway2.position.set(0, 6.8, 0.9);
    walkway2.castShadow = true;
    group.add(walkway2);

    // Decorative roof canopy over high walkways
    const walkwayRoofGeo = new THREE.BoxGeometry(towerDist * 2, 0.15, 2.5);
    const walkwayRoof = new THREE.Mesh(walkwayRoofGeo, stoneMat);
    walkwayRoof.position.set(0, 7.15, 0);
    group.add(walkwayRoof);

    // Central Bascule Deck (Opening road in the middle)
    const basculeDeckLeft = new THREE.Mesh(new THREE.BoxGeometry(towerDist * 0.95, 0.25, 2.0), bridgeBlueMat);
    basculeDeckLeft.position.set(-towerDist * 0.5, 1.5, 0);
    basculeDeckLeft.castShadow = true;
    group.add(basculeDeckLeft);

    const basculeDeckRight = new THREE.Mesh(new THREE.BoxGeometry(towerDist * 0.95, 0.25, 2.0), bridgeBlueMat);
    basculeDeckRight.position.set(towerDist * 0.5, 1.5, 0);
    basculeDeckRight.castShadow = true;
    group.add(basculeDeckRight);

    // Outer Approach Roadways
    const approachLeft = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.35, 2.0), roadMat);
    approachLeft.position.set(-towerDist - 3.8, 1.4, 0);
    group.add(approachLeft);

    const approachRight = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.35, 2.0), roadMat);
    approachRight.position.set(towerDist + 3.8, 1.4, 0);
    group.add(approachRight);

    // Suspension chains sweeping down to river banks
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.8, roughness: 0.3 });
    const createChain = (startX: number, endX: number, zOff: number) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(startX, 6.0, zOff),
        new THREE.Vector3((startX + endX) / 2, 2.4, zOff),
        new THREE.Vector3(endX, 1.4, zOff)
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.08, 8, false);
      const chain = new THREE.Mesh(tubeGeo, chainMat);
      chain.castShadow = true;
      return chain;
    };

    group.add(createChain(-towerDist, -towerDist - 6, -1.0));
    group.add(createChain(-towerDist, -towerDist - 6, 1.0));
    group.add(createChain(towerDist, towerDist + 6, -1.0));
    group.add(createChain(towerDist, towerDist + 6, 1.0));

    return group;
  };

  // Helper to construct Taj Mahal procedural model
  const buildTajMahal = (): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'TajMahal';

    // Materials
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.1,
    });
    const marblePlinthMat = new THREE.MeshStandardMaterial({
      color: 0xede8df,
      roughness: 0.5,
      metalness: 0.05,
    });
    const poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.1,
      metalness: 0.8,
    });
    const goldFinialMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
    });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.9,
    });

    // 1. Garden & Base Terrace
    const baseGarden = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.4, 18),
      new THREE.MeshStandardMaterial({ color: 0xc4b59d, roughness: 0.9 })
    );
    baseGarden.position.y = -0.2;
    baseGarden.receiveShadow = true;
    group.add(baseGarden);

    // Reflecting Pool
    const pool = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 10), poolWaterMat);
    pool.position.set(0, 0.05, 3.5);
    pool.receiveShadow = true;
    group.add(pool);

    // Cypress trees bordering pool
    [-2.2, 2.2].forEach((x) => {
      [0, 2.5, 5, 7.5].forEach((z) => {
        const tree = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.6, 8), foliageMat);
        tree.position.set(x, 0.8, z);
        tree.castShadow = true;
        group.add(tree);
      });
    });

    // 2. High Marble Plinth (Platform)
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.8, 9.6), marblePlinthMat);
    plinth.position.set(0, 0.4, -2.5);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    group.add(plinth);

    // 3. Central Octagonal Mausoleum
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, 0.8, -2.5);

    // Main cubic cube with beveled corners (octagon)
    const mainBody = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 4.0, 8), marbleMat);
    mainBody.position.y = 2.0;
    mainBody.rotation.y = Math.PI / 8;
    mainBody.castShadow = true;
    bodyGroup.add(mainBody);

    // Grand arched iwan recesses on cardinal sides
    const iwanGeo = new THREE.BoxGeometry(1.8, 2.8, 0.5);
    const iwanDarkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((rot) => {
      const arch = new THREE.Mesh(iwanGeo, iwanDarkMat);
      arch.position.set(Math.sin(rot) * 3.4, 2.0, Math.cos(rot) * 3.4);
      arch.rotation.y = rot;
      bodyGroup.add(arch);
    });

    // 4. Iconic Soaring Onion Dome
    // Built via procedural lathe points
    const domePoints: THREE.Vector2[] = [];
    domePoints.push(new THREE.Vector2(0, 0));
    domePoints.push(new THREE.Vector2(1.5, 0));
    domePoints.push(new THREE.Vector2(1.6, 0.5));
    domePoints.push(new THREE.Vector2(1.85, 1.5));
    domePoints.push(new THREE.Vector2(1.6, 2.4));
    domePoints.push(new THREE.Vector2(0.9, 3.1));
    domePoints.push(new THREE.Vector2(0.1, 3.6));
    domePoints.push(new THREE.Vector2(0, 3.8));

    const domeGeo = new THREE.LatheGeometry(domePoints, 32);
    const onionDome = new THREE.Mesh(domeGeo, marbleMat);
    onionDome.position.y = 4.0;
    onionDome.castShadow = true;
    bodyGroup.add(onionDome);

    // Golden Lotus Finial
    const finialGeo = new THREE.CylinderGeometry(0.04, 0.12, 1.2, 12);
    const finial = new THREE.Mesh(finialGeo, goldFinialMat);
    finial.position.y = 8.1;
    bodyGroup.add(finial);

    const finialBall = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), goldFinialMat);
    finialBall.position.y = 8.5;
    bodyGroup.add(finialBall);

    // 4 Chattris (smaller domed roof pavilions around central dome)
    const chattriOffsets = [
      [-1.8, -1.8],
      [1.8, -1.8],
      [-1.8, 1.8],
      [1.8, 1.8],
    ];
    chattriOffsets.forEach(([cx, cz]) => {
      const chattriGroup = new THREE.Group();
      chattriGroup.position.set(cx, 4.0, cz);

      // Columns
      const chattriColGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
      const chattriDomeGeo = new THREE.SphereGeometry(0.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);

      const cdome = new THREE.Mesh(chattriDomeGeo, marbleMat);
      cdome.position.y = 1.2;
      chattriGroup.add(cdome);

      const ccol1 = new THREE.Mesh(chattriColGeo, marbleMat);
      ccol1.position.set(-0.35, 0.6, 0);
      const ccol2 = new THREE.Mesh(chattriColGeo, marbleMat);
      ccol2.position.set(0.35, 0.6, 0);
      chattriGroup.add(ccol1);
      chattriGroup.add(ccol2);

      bodyGroup.add(chattriGroup);
    });

    group.add(bodyGroup);

    // 5. Four Slender Corner Minarets
    const minaretOffsets = [
      [-4.0, -6.5],
      [4.0, -6.5],
      [-4.0, 1.5],
      [4.0, 1.5],
    ];
    minaretOffsets.forEach(([mx, mz]) => {
      const minaretGroup = new THREE.Group();
      minaretGroup.position.set(mx, 0.8, mz);

      // Tapered column
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 6.8, 16), marbleMat);
      col.position.y = 3.4;
      col.castShadow = true;
      minaretGroup.add(col);

      // 3 Balcony Rings
      [2.2, 4.4, 6.5].forEach((by) => {
        const balcony = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.44, 0.15, 16), marbleMat);
        balcony.position.y = by;
        minaretGroup.add(balcony);
      });

      // Cap Dome
      const mDome = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), marbleMat);
      mDome.position.y = 6.9;
      minaretGroup.add(mDome);

      const mFinial = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), goldFinialMat);
      mFinial.position.y = 7.4;
      minaretGroup.add(mFinial);

      group.add(minaretGroup);
    });

    return group;
  };

  // Helper to construct Royal Palace procedural model
  const buildPalace = (): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'BuckinghamPalace';

    // Courtyard stone pavement
    const courtGeo = new THREE.PlaneGeometry(20, 16);
    const courtMat = new THREE.MeshStandardMaterial({ color: 0xd1c7b7, roughness: 0.85 });
    const court = new THREE.Mesh(courtGeo, courtMat);
    court.rotation.x = -Math.PI / 2;
    court.position.y = 0;
    court.receiveShadow = true;
    group.add(court);

    // Stone and Gold materials
    const facadeMat = new THREE.MeshStandardMaterial({
      color: 0xded6c7,
      roughness: 0.75,
      metalness: 0.1,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.6,
      metalness: 0.3,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ironGateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.25,
    });

    // 1. Main Palace Building (Central Block + East Wings)
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(14, 4.2, 3.2), facadeMat);
    mainBody.position.set(0, 2.1, -4.5);
    mainBody.castShadow = true;
    group.add(mainBody);

    // Symmetrical Side Pavilion Wings
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.4, 4.5), facadeMat);
    leftWing.position.set(-6.8, 2.2, -3.8);
    leftWing.castShadow = true;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.4, 4.5), facadeMat);
    rightWing.position.set(6.8, 2.2, -3.8);
    rightWing.castShadow = true;
    group.add(rightWing);

    // Central Classical Pediment & Colonnade (Greek portico)
    const portico = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.4, 1.2), facadeMat);
    portico.position.set(0, 4.4, -2.8);
    group.add(portico);

    const pediment = new THREE.Mesh(new THREE.ConeGeometry(3.0, 1.2, 3), facadeMat);
    pediment.position.set(0, 5.2, -2.8);
    pediment.rotation.z = Math.PI;
    pediment.rotation.y = Math.PI / 2;
    group.add(pediment);

    // Royal Balcony (Where the King / Queen waves!)
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.8), goldMat);
    balcony.position.set(0, 2.4, -2.8);
    group.add(balcony);

    // Columns across front
    const colGeo = new THREE.CylinderGeometry(0.14, 0.14, 4.0, 12);
    [-1.8, -0.6, 0.6, 1.8].forEach((cx) => {
      const col = new THREE.Mesh(colGeo, facadeMat);
      col.position.set(cx, 2.1, -2.8);
      col.castShadow = true;
      group.add(col);
    });

    // Slate Mansard Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.8, 3.4), roofMat);
    roof.position.set(0, 4.6, -4.5);
    group.add(roof);

    // 2. Central Flagpole with Royal Standard / Union Jack Flag
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.05, 3.2, 8);
    const pole = new THREE.Mesh(poleGeo, goldMat);
    pole.position.set(0, 7.2, -4.5);
    group.add(pole);

    // Procedural wavy flag mesh
    const flagGeo = new THREE.PlaneGeometry(1.4, 0.8, 8, 4);
    // Colorful red & blue British flag look
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      roughness: 0.6,
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.7, 7.9, -4.5);
    flag.name = 'RoyalFlag';
    group.add(flag);

    // 3. Wrought Iron Forecourt Gate & Gold Railings
    const gateBarGeo = new THREE.BoxGeometry(16, 1.4, 0.15);
    const fence = new THREE.Mesh(gateBarGeo, ironGateMat);
    fence.position.set(0, 0.7, 2.5);
    group.add(fence);

    // Gold finials on gate posts
    [-7.5, -3.5, 3.5, 7.5].forEach((gx) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.4), facadeMat);
      post.position.set(gx, 0.9, 2.5);
      group.add(post);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), goldMat);
      finial.position.set(gx, 2.0, 2.5);
      group.add(finial);
    });

    // 4. Two Royal Guard Sentry Boxes with Sentry figures
    [-2.2, 2.2].forEach((sx) => {
      // Black sentry wooden box
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.8, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
      );
      box.position.set(sx, 0.9, 1.5);
      group.add(box);

      // Guard Figurine
      const guardBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.7, 8),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 }) // Red coat
      );
      guardBody.position.set(sx, 0.7, 1.6);
      group.add(guardBody);

      // Bearskin tall black hat
      const bearskin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 })
      );
      bearskin.position.set(sx, 1.25, 1.6);
      group.add(bearskin);
    });

    return group;
  };

  // Initialize and swap models in Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;
    camera.position.set(0, 4, 14);

    // 3. Renderer with PBR standards
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Lighting via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point light rig
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(10, 14, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-10, 8, -10);
    scene.add(rimLight);

    // 5. Build Initial Landmark Model
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    const populateModel = (key: LandmarkModelKey) => {
      while (modelGroup.children.length > 0) {
        const obj = modelGroup.children[0];
        modelGroup.remove(obj);
      }

      let newModel: THREE.Group;
      if (key === 'london-eye') {
        newModel = buildLondonEye();
        targetDistanceRef.current = 16;
      } else if (key === 'tower-bridge') {
        newModel = buildTowerBridge();
        targetDistanceRef.current = 17;
      } else if (key === 'taj-mahal') {
        newModel = buildTajMahal();
        targetDistanceRef.current = 17;
      } else {
        newModel = buildPalace();
        targetDistanceRef.current = 16;
      }
      modelGroup.add(newModel);
      renderer.compile(scene, camera);
    };

    populateModel(activeModel);

    // 6. Interaction Handlers (Mouse & Touch Orbit)
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDownRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerXRef.current = clientX;
      prevPointerYRef.current = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isPointerDownRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevPointerXRef.current;
      const deltaY = clientY - prevPointerYRef.current;
      prevPointerXRef.current = clientX;
      prevPointerYRef.current = clientY;

      targetRotationYRef.current += deltaX * 0.008;
      cameraPitchRef.current = Math.max(0.05, Math.min(1.2, cameraPitchRef.current - deltaY * 0.005));
    };

    const onPointerUp = () => {
      isPointerDownRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetDistanceRef.current = Math.max(8, Math.min(26, targetDistanceRef.current + e.deltaY * 0.015));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    domElement.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 7. Resize Observer
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. 60fps Animation Loop with Exponential Damping
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Auto rotation when idle
      if (autoRotate && !isPointerDownRef.current) {
        targetRotationYRef.current += dt * 0.25;
      }

      // Smooth model group rotation
      if (modelGroup) {
        modelGroup.rotation.y += (targetRotationYRef.current - modelGroup.rotation.y) * (1 - Math.exp(-8 * dt));
      }

      // Smooth camera distance and height
      cameraDistanceRef.current += (targetDistanceRef.current - cameraDistanceRef.current) * (1 - Math.exp(-6 * dt));
      const dist = cameraDistanceRef.current;
      const pitch = cameraPitchRef.current;

      camera.position.x = 0;
      camera.position.y = Math.sin(pitch) * dist + 1.5;
      camera.position.z = Math.cos(pitch) * dist;
      camera.lookAt(0, 3.2, 0);

      // Model-specific animations
      // London Eye wheel spin & capsule self-leveling
      const wheelSpinner = modelGroup.getObjectByName('WheelSpinner');
      if (wheelSpinner) {
        wheelSpinner.rotation.z += dt * 0.18;
        // Keep capsules vertical
        for (let i = 0; i < 16; i++) {
          const cap = wheelSpinner.getObjectByName(`Capsule_${i}`);
          if (cap) {
            cap.rotation.z = -wheelSpinner.rotation.z;
          }
        }
      }

      // Flag flutter for Royal Palace
      const flagMesh = modelGroup.getObjectByName('RoyalFlag') as THREE.Mesh;
      if (flagMesh && flagMesh.geometry) {
        const pos = flagMesh.geometry.attributes.position;
        const count = pos.count;
        for (let i = 0; i < count; i++) {
          const u = pos.getX(i);
          pos.setZ(i, Math.sin(time * 0.005 + u * 4) * 0.12 * (u + 0.2));
        }
        pos.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      domElement.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);

      renderer.dispose();
      scene.clear();
    };
  }, [activeModel, autoRotate]);

  const handleSelectModel = (key: LandmarkModelKey) => {
    setActiveModel(key);
    setActiveFactIdx(0);
    onModelChange?.(key);
    speakEnglish(LANDMARK_METADATA[key].name);
  };

  const handleReadFact = (idx: number) => {
    setActiveFactIdx(idx);
    const fact = currentInfo.facts[idx];
    speakEnglish(`${fact.label}. ${fact.text}`);
  };

  const handleResetCamera = () => {
    targetRotationYRef.current = 0;
    cameraPitchRef.current = 0.25;
    targetDistanceRef.current = activeModel === 'london-eye' ? 16 : 17;
  };

  const handleZoom = (delta: number) => {
    targetDistanceRef.current = Math.max(8, Math.min(26, targetDistanceRef.current + delta));
  };

  return (
    <div className={`relative w-full h-[540px] md:h-[620px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 ${className}`}>
      {/* 3D WebGL Canvas container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal Top Brand Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-lg backdrop-blur-md">
          <span className="text-2xl">{currentInfo.countryEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-white text-base md:text-lg">
                {currentInfo.name}
              </h3>
              <button
                onClick={() => speakEnglish(currentInfo.name)}
                className="p-1 text-amber-400 hover:text-amber-300 transition-colors"
                title="Pronounce landmark"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 font-arabic text-right">
              {currentInfo.nameArabic}
            </p>
          </div>
        </div>

        {/* Top-Right Quick Viewport Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-lg backdrop-blur-md">
          <button
            onClick={() => handleZoom(-3)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(3)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
              autoRotate ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
            title="Toggle Spin"
          >
            {autoRotate ? 'Spin: ON' : 'Spin: OFF'}
          </button>
        </div>
      </div>

      {/* Floating Collapsible Bottom Control Dock (Strictly adhering to Three.js skill) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center">
          {/* Collapse/Expand Handle */}
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="mb-1.5 flex items-center gap-1.5 px-3 py-1 bg-slate-900/95 border border-slate-700 rounded-full text-xs font-semibold text-slate-300 hover:text-white shadow-md transition-all"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Show Landmark Details & Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Hide Controls</span>
              </>
            )}
          </button>

          {!hudCollapsed && (
            <div className="w-full bg-slate-900/95 border border-slate-700/90 rounded-3xl p-3 md:p-4 shadow-2xl backdrop-blur-md transition-all">
              {/* Landmark Selection Row */}
              <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
                  Landmarks:
                </span>
                {(
                  [
                    { key: 'london-eye', label: 'London Eye 🎡', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                    { key: 'tower-bridge', label: 'Tower Bridge 🌉', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                    { key: 'taj-mahal', label: 'Taj Mahal 🕌', flag: '🇮🇳' },
                    { key: 'palace', label: "Queen's Palace 👑", flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleSelectModel(item.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold shrink-0 transition-all ${
                      activeModel === item.key
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Active Landmark Fact Cards */}
              <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-2">
                {currentInfo.facts.map((fact, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleReadFact(idx)}
                    className={`text-left p-2.5 rounded-2xl border transition-all ${
                      activeFactIdx === idx
                        ? 'bg-amber-500/15 border-amber-500/50 text-white'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-amber-400">
                        {fact.label}
                      </span>
                      <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                    <p className="text-xs leading-snug line-clamp-2">
                      {fact.text}
                    </p>
                    <p className="text-[11px] text-slate-400 font-arabic text-right mt-1 line-clamp-1">
                      {fact.textArabic}
                    </p>
                  </button>
                ))}
              </div>

              {/* Drag/Touch Hint */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>🖱️ Drag or swipe to orbit 360° | Scroll to zoom</span>
                <span className="font-arabic">اسحب بإصبعك أو بالفأرة لتدوير المعلم 360 درجة</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
