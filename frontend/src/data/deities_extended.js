// Extended deities data — Venkateswara, Narasimha, Lalitha, Kali, Dattatreya, Navagraha,
// Kubera, Padmavathi, Gayatri, Parvathi, Raghavendra, Varahi, Annapurna, Chamundeshwari,
// Mahalakshmi (Kolhapur), Ganga, Bhairava, Dhanvantari, Varaha, Tulasi (Deity), Santoshi Ma.
// Following the same schema as deities.js.

// Wikimedia / Archive.org public-domain devotional audio (all HTTPS + verified URL pattern)
const AX = {
  venkateswara_supra: "https://archive.org/download/VenkatesaSuprabhatam_201908/Venkatesa%20Suprabhatam.mp3",
  narasimha: "https://archive.org/download/LakshmiNarasimhaKarunaRasaStotramMSSubbulakshmi/Lakshmi%20Narasimha%20Karuna%20Rasa%20Stotram%20-%20MS%20Subbulakshmi.mp3",
  lalitha: "https://archive.org/download/lalitha-sahasranam-pri/Lalitha%20Sahasranam%20pri.mp3",
  dattatreya: "https://archive.org/download/DattaBavani_201910/Datta%20Bavani.mp3",
  raghavendra: "https://archive.org/download/SriRaghavendraStotra/Sri%20Raghavendra%20Stotra.mp3",
  gayatri108: "https://archive.org/download/tibetan-buddhist-monks-chanting-of-gayatri-mantra-108-times-meditacion/Tibetan%20Buddhist%20Monks%20Chanting%20Of%20Gayatri%20Mantra%20(108%20Times)%20meditaci%C3%B3n.mp3",
  kubera: "https://archive.org/download/KuberaAshtakam/Kubera%20Ashtakam.mp3",
  kali: "https://archive.org/download/KaliMantra108Times/Kali%20Mantra%20108%20Times.mp3",
  annapurna: "https://archive.org/download/AnnapoornaStotram/Annapoorna%20Stotram.mp3",
  parvathi: "https://archive.org/download/AigiriNandini_MSSubbulakshmi/Aigiri%20Nandini%20-%20MS%20Subbulakshmi.mp3",
  navagraha: "https://archive.org/download/NavagrahaStotram/Navagraha%20Stotram.mp3",
  dhanvantari: "https://archive.org/download/DhanvantariMantra108Times/Dhanvantari%20Mantra%20108%20Times.mp3",
  bhairava: "https://archive.org/download/KalabhairavaAshtakam/Kalabhairava%20Ashtakam.mp3",
  varahi: "https://archive.org/download/VaarahiAnugrahaAshtakam/Vaarahi%20Anugraha%20Ashtakam.mp3",
};

// Additional background chants — expand user's chant selector
export const EXTENDED_BACKGROUND_CHANTS = [
  { id: "venkateswara_supra", label: "Veṅkaṭeśvara Suprabhātam", url: AX.venkateswara_supra },
  { id: "dattatreya", label: "Datta Bāvani", url: AX.dattatreya },
  { id: "raghavendra", label: "Rāghavendra Stotra", url: AX.raghavendra },
  { id: "navagraha", label: "Navagraha Stotram", url: AX.navagraha },
];

// All deity portraits are self-hosted at /app/backend/static/deities/*.png
// Served by FastAPI static mount at /api/static/deities/{id}.png
const BACKEND = process.env.REACT_APP_BACKEND_URL || "";
const D = (id) => `${BACKEND}/api/static/deities/${id}.png`;

const IMGX = {
  venkateswara: D("venkateswara"),
  narasimha: D("narasimha"),
  lalitha: D("lalitha"),
  kali: D("kali"),
  padmavathi: D("padmavathi"),
  dattatreya: D("dattatreya"),
  gayatri: D("gayatri"),
  kubera: D("kubera"),
  chamundeshwari: D("chamundeshwari"),
  mahalakshmi_kolhapur: D("mahalakshmi_kolhapur"),
  annapurna: D("annapurna"),
  ganga: D("ganga"),
  bhairava: D("bhairava"),
  dhanvantari: D("dhanvantari"),
  varaha: D("varaha"),
  varahi: D("varahi"),
  santoshi: D("santoshi"),
  navagraha: D("navagraha"),
  vishwakarma: D("vishwakarma"),
  parvathi: D("parvathi"),
  raghavendra: D("raghavendra"),
  veerabrahmendra: D("veerabrahmendra"),
};

const dx = (id, names, color, mula, dhyana, meaning, stotras, ashtot, songs, image) => ({
  id, name: names, color, mula_mantra: mula, dhyana_sloka: dhyana, meaning,
  stotras, ashtottara_sample: ashtot, songs, image,
});

export const EXTENDED_DEITIES = [
  // 1. Venkateswara Swamy (Balaji)
  dx("venkateswara",
    { en: "Venkateswara (Balaji)", te: "వేంకటేశ్వర స్వామి", hi: "वेंकटेश्वर (बालाजी)", ta: "வேங்கடேசுவரர்", sa: "वेङ्कटेश्वरः" },
    "#7C2D12",
    { sa: "ॐ नमो वेङ्कटेशाय", en: "Om Namo Veṅkaṭeśāya", meaning: { en: "Salutations to Lord Venkateswara of Tirumala.", te: "తిరుమల వేంకటేశ్వరుడికి నమస్కారం.", hi: "तिरुमला वेंकटेश्वर को नमन।", ta: "திருமலை வேங்கடேசுவரருக்கு நமஸ்காரம்." } },
    "कौसल्यासुप्रजा राम पूर्वासन्ध्या प्रवर्तते।\nउत्तिष्ठ नरशार्दूल कर्तव्यं दैवमाह्निकम्॥",
    { en: "O Rama, dear son of Kausalya, the eastern dawn breaks — arise, O lion among men, and perform the daily divine duties." },
    ["Veṅkaṭeśvara Suprabhātam", "Veṅkaṭeśvara Stotram", "Veṅkaṭeśvara Aṣṭottara", "Śrī Veṅkaṭeśa Sahasranāmam", "Bhaja Govindam"],
    ["Śrīnivāsa", "Bālājī", "Govinda", "Veṅkaṭeśa", "Śrīśa", "Śeṣādrivāsa", "Padmāvatīpati", "Ānandanilaya", "Tirumaleśa", "Ālamelmaṅga Sameta", "Ezhumalaiyān", "Kaliyugavaradāya"],
    [{ title: "Venkatesa Suprabhatam", url: AX.venkateswara_supra }],
    IMGX.venkateswara
  ),
  // 2. Padmavathi (Consort of Venkateswara)
  dx("padmavathi",
    { en: "Padmavathi", te: "పద్మావతి అమ్మవారు", hi: "पद्मावती", ta: "பத்மாவதி", sa: "पद्मावती" },
    "#DB2777",
    { sa: "ॐ श्रीं पद्मावत्यै नमः", en: "Om Śrīṁ Padmāvatyai Namaḥ", meaning: { en: "Salutations to Goddess Padmavathi, consort of Sri Venkateswara.", te: "శ్రీ వేంకటేశ్వరుని దేవి పద్మావతి అమ్మవారికి నమస్కారం.", hi: "श्रीवेंकटेश्वर की पत्नी पद्मावती को नमन।", ta: "ஸ்ரீவேங்கடேசுவரரின் தேவி பத்மாவதிக்கு நமஸ்காரம்." } },
    "पद्मासने पद्महस्तां पद्मवर्णां शुभप्रदाम्।\nपद्मावतीं महादेवीं वन्दे श्रीनिवासप्रियाम्॥",
    { en: "Seated on lotus, lotus-hued, lotus in hand, bestower of auspiciousness — I bow to Padmavathi, beloved of Srinivasa." },
    ["Padmāvatī Aṣṭottara", "Padmāvatī Stotram", "Alarmelmaṅga Stotram", "Padmāvatī Stuti"],
    ["Alarmelmaṅga", "Vakuḷamātā-Putrī", "Ākāśarājakumārī", "Kamalākṣī", "Kāmākṣī", "Padmāsanā", "Ratnamālinī", "Sarvamaṅgaladāyinī"],
    [],
    IMGX.padmavathi
  ),
  // 3. Narasimha Swamy
  dx("narasimha",
    { en: "Narasimha", te: "నరసింహ స్వామి", hi: "नरसिंह", ta: "நரசிம்மர்", sa: "नरसिंहः" },
    "#7F1D1D",
    { sa: "ॐ उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्", en: "Om Ugraṁ Vīraṁ Mahāviṣṇuṁ Jvalantaṁ Sarvatomukham", meaning: { en: "Salutations to fierce, brave, blazing, all-faced Lord Narasimha.", te: "ఉగ్రుడు, వీరుడు, జ్వలిస్తూ ఉన్న సర్వతోముఖుడైన నరసింహునికి నమస్కారం.", hi: "उग्र, वीर, ज्वलंत, सर्वतोमुख नरसिंह को नमन।", ta: "உக்கிரமான, வீரமான, ஜ்வலிக்கின்ற, சர்வதோமுகனான நரசிம்மருக்கு நமஸ்காரம்." } },
    "सत्यज्ञानसुखस्वरूपमजरं विश्वस्य सृष्ट्युद्भवं।\nस्थेमप्रज्ञापि नाशहेतुमजितं विष्णुं महात्मानम्॥",
    { en: "Embodiment of truth-knowledge-bliss, undecaying, cause of the universe's creation, sustenance and dissolution — the invincible Mahavishnu, I meditate upon." },
    ["Narasiṁha Kavacham", "Lakṣmī Narasiṁha Karāvalambam", "Narasiṁha Aṣṭakam", "Narasiṁha Maṅgalāṣṭakam"],
    ["Ugra Narasiṁha", "Yoga Narasiṁha", "Lakṣmī Narasiṁha", "Jvālā Narasiṁha", "Ahobila Narasiṁha", "Prahlāda Varada", "Hiraṇyamardana", "Sarvato-mukha", "Sudarśana Narasiṁha"],
    [{ title: "Lakshmi Narasimha Karuna Rasa Stotram", url: AX.narasimha }],
    IMGX.narasimha
  ),
  // 4. Varaha
  dx("varaha",
    { en: "Varaha", te: "వరాహ స్వామి", hi: "वराह", ta: "வராகர்", sa: "वराहः" },
    "#4A044E",
    { sa: "ॐ भूवराहाय नमः", en: "Om Bhūvarāhāya Namaḥ", meaning: { en: "Salutations to the Boar-form Vishnu who lifted Bhudevi.", te: "భూదేవిని ఉద్ధరించిన వరాహ మూర్తికి నమస్కారం.", hi: "पृथ्वी को उठाने वाले वराह भगवान को नमन।", ta: "பூமியை உய்யக்கொண்ட வராக பகவானுக்கு நமஸ்காரம்." } },
    "प्रलयपयोधिजले धृतवानसि वेदम्।\nविहितवहित्रचरित्रमखेदम्॥",
    { en: "In the waters of dissolution you upheld the Vedas — playing the role of the great boat-boar without fatigue." },
    ["Varāha Stotram", "Varāha Kavacham", "Bhūmi Varāha Aṣṭakam"],
    ["Ādi Varāha", "Yajña Varāha", "Śrī Varāha", "Bhū Varāha", "Nīlā Varāha", "Pralaya Varāha"],
    [],
    IMGX.varaha
  ),
  // 5. Dattatreya
  dx("dattatreya",
    { en: "Dattatreya", te: "దత్తాత్రేయ స్వామి", hi: "दत्तात्रेय", ta: "தத்தாத்ரேயர்", sa: "दत्तात्रेयः" },
    "#B45309",
    { sa: "ॐ द्रां दत्तात्रेयाय नमः", en: "Om Drāṁ Dattātreyāya Namaḥ", meaning: { en: "Salutations to Dattatreya, the triple form of Brahma-Vishnu-Shiva.", te: "బ్రహ్మ-విష్ణు-శివుల త్రిమూర్తి రూపమైన దత్తాత్రేయుడికి నమస్కారం.", hi: "ब्रह्मा-विष्णु-शिव त्रिमूर्ति दत्तात्रेय को नमन।", ta: "பிரம்மா-விஷ்ணு-சிவனின் திரிமூர்த்தி தத்தாத்திரேயருக்கு நமஸ்காரம்." } },
    "जटाधरं पाण्डुरङ्गं शूलहस्तं कृपानिधिम्।\nसर्वरोगहरं देवं दत्तात्रेयमहं भजे॥",
    { en: "Matted-locks, fair-hued, trident-handed, ocean of mercy, destroyer of all diseases — I worship Lord Dattatreya." },
    ["Datta Bāvani", "Śrī Dattātreya Stotram", "Datta Aṣṭottara", "Guru Caritra", "Avadhūta Gītā"],
    ["Datta", "Guru", "Avadhūta", "Digambara", "Trimūrti", "Ātri-putra", "Anasūyā-suta", "Yogīśvara", "Śiva-Viṣṇu-Brahma-Svarūpa"],
    [{ title: "Datta Bavani", url: AX.dattatreya }],
    IMGX.dattatreya
  ),
  // 6. Lalitha Tripura Sundari
  dx("lalitha",
    { en: "Lalitha Tripura Sundari", te: "లలితా త్రిపుర సుందరి", hi: "ललिता त्रिपुर सुन्दरी", ta: "லலிதா திரிபுர சுந்தரி", sa: "ललिता त्रिपुरसुन्दरी" },
    "#BE185D",
    { sa: "ॐ ऐं ह्रीं श्रीं श्रीमात्रे नमः", en: "Om Aim Hrīṁ Śrīṁ Śrīmātre Namaḥ", meaning: { en: "Salutations to the auspicious Divine Mother Lalitha.", te: "శ్రీమాత లలితా దేవికి నమస్కారం.", hi: "श्रीमाता ललिता को नमन।", ta: "ஸ்ரீமாதா லலிதாவுக்கு நமஸ்காரம்." } },
    "सिन्दूरारुणविग्रहां त्रिनयनां माणिक्यमौलिस्फुरत्।\nतारानायकशेखरां स्मितमुखीमापीनवक्षोरुहाम्॥",
    { en: "Vermilion-hued form, three-eyed, crown of rubies flashing, adorned with the moon on her tresses, smiling-faced with full bosom — I meditate on Lalitha." },
    ["Lalitā Sahasranāmam", "Lalitā Triśatī", "Saundaryalaharī", "Śyāmalā Daṇḍakam", "Śrī Sūktam"],
    ["Śrīmātā", "Śrīmahārājñī", "Śrīmatsimhāsaneśvarī", "Cidagnikuṇḍa-Sambhūtā", "Deva-Kārya-Samudyatā", "Udyadbhānu-Sahasrābhā", "Cāturbhāhu-Samanvitā", "Rāgasvarūpa-Pāśāḍhyā"],
    [{ title: "Lalitha Sahasranamam", url: AX.lalitha }],
    IMGX.lalitha
  ),
  // 7. Kali (Kalika)
  dx("kali",
    { en: "Kali (Kalika)", te: "కాళికా దేవి", hi: "काली (कालिका)", ta: "காளிகா", sa: "काली" },
    "#111827",
    { sa: "ॐ क्रीं कालिकायै नमः", en: "Om Krīṁ Kālikāyai Namaḥ", meaning: { en: "Salutations to Goddess Kali, destroyer of time and evil.", te: "కాలాన్ని, దుష్టత్వాన్ని నాశనం చేసే కాళికా దేవికి నమస్కారం.", hi: "काल और अधर्म को नष्ट करने वाली माँ काली को नमन।", ta: "காலத்தையும் தீமையையும் அழிக்கும் காளிக்கு நமஸ்காரம்." } },
    "करालवदनां घोरां मुक्तकेशीं चतुर्भुजाम्।\nकालिकां दक्षिणां दिव्यां मुण्डमालाविभूषिताम्॥",
    { en: "Terrible-faced, fierce, hair loosened, four-armed, southern-facing divine Kalika, adorned with a garland of skulls — I meditate upon her." },
    ["Śyāmā Aṣṭakam", "Karpūrādi Stotram", "Kālī Kavacham", "Mahiṣāsura Mardinī Stotram", "Bhavānī Aṣṭakam"],
    ["Kālī", "Kālikā", "Dakṣiṇakālī", "Bhadrakālī", "Cāmuṇḍā", "Śmaśānakālī", "Guhyakālī", "Mahākālī"],
    [{ title: "Kali Mantra 108 Times", url: AX.kali }],
    IMGX.kali
  ),
  // 8. Varahi
  dx("varahi",
    { en: "Varahi", te: "వారాహి దేవి", hi: "वाराही", ta: "வாராஹி", sa: "वाराही" },
    "#831843",
    { sa: "ॐ ऐं ग्लौं ऐं नमो भगवति वार्तालि वार्तालि वाराहि वाराहि", en: "Om Aim Glauṁ Aim Namo Bhagavati Vārtāli Vārtāli Vārāhi Vārāhi", meaning: { en: "Salutations to fierce Varahi, the boar-faced mother, one of the seven Matrikas.", te: "సప్తమాతృకలలో ఒకరైన వరాహ ముఖం గల వారాహి దేవికి నమస్కారం.", hi: "सप्तमातृका में एक — वराह-मुखी वाराही को नमन।", ta: "ஸப்தமாத்ருக்களில் ஒருவரான வராகமுகி வாராகிக்கு நமஸ்காரம்." } },
    "पञ्चमी दण्डनाथा सा वाराही परमेश्वरी।\nस्तम्भिनी क्षोभिणी चैव सर्वारिबलनाशिनी॥",
    { en: "The fifth (of Lalitha's attendants), Dandanatha — Varahi Parameshwari, the paralyser, agitator, destroyer of all enemy forces." },
    ["Vārāhī Anugraha Aṣṭakam", "Vārāhī Kavacham", "Vārāhī Mantra Stotram", "Daṇḍanāthā Stotram"],
    ["Daṇḍanāthā", "Pañcamī", "Vārtālī", "Ghorāsyā", "Vārāhī", "Kirātini", "Krodha-varāhī", "Śatru-nāśinī"],
    [{ title: "Vaarahi Anugraha Ashtakam", url: AX.varahi }],
    IMGX.varahi
  ),
  // 9. Navagraha (9 planets — as a unified deity page)
  dx("navagraha",
    { en: "Navagraha (9 Planets)", te: "నవగ్రహాలు", hi: "नवग्रह", ta: "நவக்கிரகங்கள்", sa: "नवग्रहाः" },
    "#334155",
    { sa: "ॐ नवग्रहेभ्यो नमः", en: "Om Navagrahebhyo Namaḥ", meaning: { en: "Salutations to the nine planetary deities.", te: "నవగ్రహాలకు నమస్కారం.", hi: "नौ ग्रह देवताओं को नमन।", ta: "நவக்கிரக தேவதைகளுக்கு நமஸ்காரம்." } },
    "जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम्।\nतमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥\n(Hymn to Sun; followed by mantras for each graha)",
    { en: "Radiant hymns to each of the nine planetary lords — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu." },
    ["Navagraha Stotram", "Navagraha Kavacham", "Ādityahṛdayam", "Śani Aṣṭakam", "Rāhu Kavacham", "Ketu Kavacham"],
    ["Sūrya (Ravi)", "Candra (Soma)", "Maṅgala (Kuja)", "Budha", "Bṛhaspati (Guru)", "Śukra", "Śani", "Rāhu", "Ketu"],
    [{ title: "Navagraha Stotram", url: AX.navagraha }],
    IMGX.navagraha
  ),
  // 10. Kubera
  dx("kubera",
    { en: "Kubera", te: "కుబేరుడు", hi: "कुबेर", ta: "குபேரன்", sa: "कुबेरः" },
    "#CA8A04",
    { sa: "ॐ श्रीं ह्रीं क्लीं कुबेराय नमः", en: "Om Śrīṁ Hrīṁ Klīṁ Kuberāya Namaḥ", meaning: { en: "Salutations to Kubera, lord of wealth and treasures.", te: "సర్వసంపదల అధిపతి కుబేరుడికి నమస్కారం.", hi: "धन के अधिपति कुबेर को नमन।", ta: "செல்வத்திற்குத் தலைவன் குபேரனுக்கு நமஸ்காரம்." } },
    "मनुष्यवाहिनं देवं शरणागतवत्सलम्।\nसर्वैश्वर्यप्रदातारं कुबेरं प्रणमाम्यहम्॥",
    { en: "Riding on a human-like vehicle, protector of refuge-seekers, bestower of all wealth — I bow to Lord Kubera." },
    ["Kubera Aṣṭakam", "Kubera Stotram", "Kubera Sahasranāma", "Lakṣmī Kubera Mantra"],
    ["Yakṣa-rāja", "Dhaneśa", "Vaiśravaṇa", "Ratnagarbha", "Nara-vāhana", "Ekapiṅga", "Rājarāja", "Yakṣendra"],
    [{ title: "Kubera Ashtakam", url: AX.kubera }],
    IMGX.kubera
  ),
  // 11. Gayatri
  dx("gayatri",
    { en: "Gayatri", te: "గాయత్రి", hi: "गायत्री", ta: "காயத்ரி", sa: "गायत्री" },
    "#C2410C",
    { sa: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम्। भर्गो देवस्य धीमहि। धियो यो नः प्रचोदयात्॥", en: "Om Bhūr Bhuvaḥ Svaḥ Tat Savitur Vareṇyaṁ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt", meaning: { en: "We meditate on the adorable splendor of the Divine Sun — may he inspire our intellects.", te: "సవితా దేవుని దివ్య తేజస్సును ధ్యానిస్తున్నాము — మా బుద్ధులను ప్రేరేపించుగాక.", hi: "सविता देव के दिव्य तेज का ध्यान — वह हमारी बुद्धि को प्रेरित करे।", ta: "சவிதா தேவனின் தெய்வீக ஒளியை தியானிக்கிறோம் — நமது புத்தியை உணர்த்துக." } },
    "मुक्ताविद्रुमहेमनीलधवलच्छायैर्मुखैस्त्रीक्षणैः।\nयुक्तां इन्दुनिबद्धरत्नमुकुटां तत्त्वार्थवर्णात्मिकाम्॥",
    { en: "Five-faced (pearl-white, coral, gold, sapphire, white), three-eyed, moon-crested jewel-crowned Gayatri — the embodiment of every letter and truth of the Vedas." },
    ["Gāyatrī Sahasranāma", "Gāyatrī Kavacham", "Gāyatrī Hṛdayam", "Sāvitrī Aṣṭakam"],
    ["Vedamātā", "Sāvitrī", "Sarasvatī-svarūpiṇī", "Pañcamukhī", "Devī", "Chandas-mātā", "Ṛg-svarūpā", "Trikāla-Sandhyā-Adhīśvarī"],
    [{ title: "Gayatri Mantra (108 Times)", url: AX.gayatri108 }],
    IMGX.gayatri
  ),
  // 12. Parvathi
  dx("parvathi",
    { en: "Parvathi", te: "పార్వతి దేవి", hi: "पार्वती", ta: "பார்வதி", sa: "पार्वती" },
    "#9F1239",
    { sa: "ॐ पार्वत्यै नमः", en: "Om Pārvatyai Namaḥ", meaning: { en: "Salutations to Goddess Parvathi, consort of Lord Shiva.", te: "శివుని దేవి పార్వతికి నమస్కారం.", hi: "शिव-पत्नी माँ पार्वती को नमन।", ta: "சிவனின் தேவி பார்வதிக்கு நமஸ்காரம்." } },
    "अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दिनुते।\nगिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते॥",
    { en: "O daughter of the mountain, delight of the earth, playmate of the universe, praised by Nandi — dweller on Vindhya's peak, playful with Vishnu, praised by Indra." },
    ["Mahiṣāsura Mardinī Stotram", "Devī Aparādhakṣamāpaṇa Stotram", "Bhavānyaṣṭakam", "Umā Sahasranāma", "Śyāmalā Daṇḍakam"],
    ["Umā", "Gaurī", "Ambikā", "Bhavānī", "Śaṅkarī", "Girijā", "Śailaputrī", "Annapūrṇā", "Kātyāyanī", "Kalyāṇī"],
    [{ title: "Aigiri Nandini — MS Subbulakshmi", url: AX.parvathi }],
    IMGX.parvathi
  ),
  // 13. Raghavendra Swamy
  dx("raghavendra",
    { en: "Raghavendra Swamy", te: "రాఘవేంద్ర స్వామి", hi: "राघवेन्द्र स्वामी", ta: "ராகவேந்திர சுவாமி", sa: "राघवेन्द्रः" },
    "#A16207",
    { sa: "ॐ श्रीराघवेन्द्राय नमः", en: "Om Śrī Rāghavendrāya Namaḥ", meaning: { en: "Salutations to Sri Raghavendra Swamy, guru of Mantralayam.", te: "మంత్రాలయ మహిమాన్విత గురు రాఘవేంద్ర స్వామికి నమస్కారం.", hi: "मंत्रालय के गुरु राघवेन्द्र स्वामी को नमन।", ta: "மந்திரால்யத்தின் குரு ராகவேந்திர சுவாமிக்கு நமஸ்காரம்." } },
    "पूज्याय राघवेन्द्राय सत्यधर्मरताय च।\nभजतां कल्पवृक्षाय नमतां कामधेनवे॥",
    { en: "Salutations to the venerable Raghavendra, devoted to truth and dharma — the kalpavriksha to worshippers, the kamadhenu to those who bow." },
    ["Rāghavendra Stotra", "Śrī Guru Rāghavendra Aṣṭakam", "Rāyara Aṣṭottara", "Maṅgalāṣṭakam"],
    ["Rāyaru", "Mantrālaya-vāsi", "Guru-sārvabhauma", "Sudhīndra-tīrtha-śiṣya", "Prahlāda-avatāra", "Kalpavṛkṣa", "Kāmadhenu", "Mrittika-vṛnda-vāsa"],
    [{ title: "Sri Raghavendra Stotra", url: AX.raghavendra }],
    IMGX.raghavendra
  ),
  // 14. Annapurna
  dx("annapurna",
    { en: "Annapurna", te: "అన్నపూర్ణ దేవి", hi: "अन्नपूर्णा", ta: "அன்னபூர்ணி", sa: "अन्नपूर्णा" },
    "#B45309",
    { sa: "ॐ अन्नपूर्णायै नमः", en: "Om Annapūrṇāyai Namaḥ", meaning: { en: "Salutations to Goddess Annapurna, bestower of food and nourishment.", te: "అన్నదానకర్త అన్నపూర్ణా దేవికి నమస్కారం.", hi: "अन्नदानदात्री माँ अन्नपूर्णा को नमन।", ta: "அன்னதானம் அளிப்பவளான அன்னபூர்ணிக்கு நமஸ்காரம்." } },
    "अन्नपूर्णे सदा पूर्णे शङ्करप्राणवल्लभे।\nज्ञानवैराग्यसिद्ध्यर्थं भिक्षां देहि च पार्वति॥",
    { en: "O Annapurna, ever-full, beloved of Shankara — grant me the alms of knowledge and dispassion, O Parvati." },
    ["Annapūrṇā Stotram", "Annapūrṇā Aṣṭakam", "Kāśī Annapūrṇā Stotram"],
    ["Annadā", "Bhikṣāndehi", "Kāśīśvarī", "Viśvamātā", "Pārvatī", "Bhojana-dāyinī", "Amṛta-svarūpiṇī"],
    [{ title: "Annapoorna Stotram", url: AX.annapurna }],
    IMGX.annapurna
  ),
  // 15. Chamundeshwari
  dx("chamundeshwari",
    { en: "Chamundeshwari", te: "చాముండేశ్వరి", hi: "चामुण्डेश्वरी", ta: "சாமுண்டேசுவரி", sa: "चामुण्डेश्वरी" },
    "#991B1B",
    { sa: "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे", en: "Om Aim Hrīṁ Klīṁ Cāmuṇḍāyai Vicche", meaning: { en: "The Navārṇa mantra — salutations to fierce Chamundeshwari of Mysuru.", te: "నవార్ణ మంత్రం — మైసూరు చాముండేశ్వరికి నమస్కారం.", hi: "नवार्ण मंत्र — मैसूरु की चामुण्डेश्वरी को नमन।", ta: "நவார்ண மந்திரம் — மைசூரு சாமுண்டேசுவரிக்கு நமஸ்காரம்." } },
    "चण्डमुण्डवधे शक्तिर्महिषासुरनाशिनी।\nचामुण्डेश्वरि नमस्तुभ्यं भवबन्धविमोचिनि॥",
    { en: "Power in the slaying of Chanda and Munda, destroyer of Mahishasura — salutations to you, O Chamundeshwari, liberator from worldly bondage." },
    ["Devī Māhātmyam", "Cāmuṇḍā Stotram", "Cāmuṇḍā Aṣṭottara", "Mahiṣāsura Mardinī Stotram"],
    ["Cāmuṇḍā", "Mahiṣāsura-mardinī", "Caṇḍikā", "Bhadrakālī", "Ambā", "Cāmuṇḍeśvarī", "Krodha-rūpiṇī"],
    [],
    IMGX.chamundeshwari
  ),
  // 16. Mahalakshmi (Kolhapur)
  dx("mahalakshmi_kolhapur",
    { en: "Mahalakshmi (Kolhapur)", te: "కొల్హాపుర్ మహాలక్ష్మి", hi: "कोल्हापुर महालक्ष्मी", ta: "கோலாபூர் மகாலக்ஷ்மி", sa: "महालक्ष्मी (कोल्हापुरनिवासिनी)" },
    "#DC2626",
    { sa: "ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः", en: "Om Śrīṁ Hrīṁ Klīṁ Mahālakṣmyai Namaḥ", meaning: { en: "Salutations to Mahalakshmi of Kolhapur, one of the Shakti Peethas.", te: "శక్తిపీఠాలలో ఒకటైన కొల్హాపుర్ మహాలక్ష్మికి నమస్కారం.", hi: "शक्तिपीठ कोल्हापुर की महालक्ष्मी को नमन।", ta: "சக்திபீடமான கோலாபூர் மகாலக்ஷ்மிக்கு நமஸ்காரம்." } },
    "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते॥",
    { en: "Salutations to you, great Maya, seated on Sri-peetha, worshipped by devas — conch, discus, mace in your hands — Mahalakshmi, salutations." },
    ["Mahālakṣmī Aṣṭakam", "Kanakadhārā Stotram", "Śrī Sūktam", "Lakṣmī Sahasranāma", "Mahālakṣmī Kavacham"],
    ["Ambābāī", "Karvīra-nivāsinī", "Mahālakṣmī", "Śrī", "Padmāsanā", "Ratnāṭṭahāsa", "Śaṅkha-cakra-gadā-dhāriṇī"],
    [],
    IMGX.mahalakshmi_kolhapur
  ),
  // 17. Ganga
  dx("ganga",
    { en: "Ganga", te: "గంగా దేవి", hi: "गंगा", ta: "கங்கை", sa: "गङ्गा" },
    "#0891B2",
    { sa: "ॐ श्रीगङ्गायै नमः", en: "Om Śrī Gaṅgāyai Namaḥ", meaning: { en: "Salutations to Ganga, the celestial river of purification.", te: "పవిత్రతనొసగే గంగానదికి నమస్కారం.", hi: "पावन गंगा माता को नमन।", ta: "புனித கங்கை அன்னைக்கு நமஸ்காரம்." } },
    "देवि सुरेश्वरि भगवति गङ्गे त्रिभुवनतारिणि तरलतरङ्गे।\nशङ्करमौलिविहारिणि विमले मम मतिरास्तां तव पदकमले॥",
    { en: "O Devi, queen of gods, blessed Ganga, saviour of the three worlds, trembling-waved, playing on Shankara's crest, pure — may my mind rest at your lotus feet." },
    ["Gaṅgā Stotram (Ādi Śaṅkara)", "Gaṅgā Aṣṭakam", "Gaṅgā Laharī", "Gaṅgā Sahasranāma"],
    ["Bhāgīrathī", "Jāhnavī", "Mandākinī", "Tripathagā", "Sureśvarī", "Viṣṇupadī", "Śiva-mauli-vihāriṇī"],
    [],
    IMGX.ganga
  ),
  // 18. Bhairava
  dx("bhairava",
    { en: "Bhairava", te: "కాలభైరవ స్వామి", hi: "काल भैरव", ta: "காலபைரவர்", sa: "कालभैरवः" },
    "#1F2937",
    { sa: "ॐ ह्रीं बटुकाय आपदुद्धारणाय कुरु कुरु बटुकाय ह्रीं", en: "Om Hrīṁ Baṭukāya Āpaduddhāraṇāya Kuru Kuru Baṭukāya Hrīṁ", meaning: { en: "Salutations to Batuka Bhairava, remover of dire calamities.", te: "ఆపదలను తీర్చే బటుక భైరవునికి నమస్కారం.", hi: "आपत्ति-निवारक बटुक भैरव को नमन।", ta: "ஆபத்துகளை நீக்கும் பட்டுக பைரவருக்கு நமஸ்காரம்." } },
    "देवराजसेव्यमानपावनाङ्घ्रिपङ्कजं।\nव्यालयज्ञसूत्रमिन्दुशेखरं कृपाकरम्॥",
    { en: "Whose lotus feet are worshipped by the king of gods, with serpent as sacred thread, moon on the crest, ocean of mercy — I meditate on Kalabhairava." },
    ["Kālabhairava Aṣṭakam", "Baṭuka Bhairava Kavacham", "Bhairava Stotram"],
    ["Kālabhairava", "Baṭuka-bhairava", "Ānanda-bhairava", "Aṣṭāṅga-bhairava", "Kṣetra-pāla", "Bhīṣaṇa", "Śaṅkara-svarūpī"],
    [{ title: "Kalabhairava Ashtakam", url: AX.bhairava }],
    IMGX.bhairava
  ),
  // 19. Dhanvantari
  dx("dhanvantari",
    { en: "Dhanvantari", te: "ధన్వంతరి", hi: "धन्वन्तरि", ta: "தன்வந்திரி", sa: "धन्वन्तरिः" },
    "#047857",
    { sa: "ॐ नमो भगवते धन्वन्तरये", en: "Om Namo Bhagavate Dhanvantaraye", meaning: { en: "Salutations to Lord Dhanvantari, the divine physician of the devas.", te: "దేవవైద్యుడైన ధన్వంతరికి నమస్కారం.", hi: "देववैद्य धन्वन्तरि को नमन।", ta: "தேவ வைத்தியர் தன்வந்திரிக்கு நமஸ்காரம்." } },
    "शङ्खं चक्रं जलौकां दधतममृतघटं चारुदोर्भिश्चतुर्भिः।\nसूक्ष्मस्वच्छातिहृद्यांशुकपरिविलसन्मौलिमम्भोजनेत्रम्॥",
    { en: "Bearing conch, discus, leech and pot of amrita in his four graceful arms, radiant with subtle transparent silk on his crown, lotus-eyed — I meditate on Dhanvantari." },
    ["Dhanvantari Stotram", "Dhanvantari Aṣṭottara", "Dhanvantari Kavacham"],
    ["Bhiṣak-cakravartī", "Amṛta-kalaśa-hasta", "Vaidyanātha", "Ādi-vaidya", "Sudhā-hasta", "Roga-hara"],
    [{ title: "Dhanvantari Mantra 108 Times", url: AX.dhanvantari }],
    IMGX.dhanvantari
  ),
  // 20. Santoshi Ma
  dx("santoshi",
    { en: "Santoshi Ma", te: "సంతోషి మాత", hi: "सन्तोषी माँ", ta: "சந்தோஷி மாதா", sa: "सन्तोषीमाता" },
    "#EA580C",
    { sa: "ॐ सन्तोषीमात्रे नमः", en: "Om Santoṣī Mātre Namaḥ", meaning: { en: "Salutations to Santoshi Ma, giver of contentment.", te: "సంతృప్తినొసగే సంతోషీ మాతకు నమస్కారం.", hi: "संतोष प्रदान करने वाली माँ सन्तोषी को नमन।", ta: "மனநிறைவை அளிக்கும் சந்தோஷி மாதாவுக்கு நமஸ்காரம்." } },
    "जय सन्तोषी मात मैया जय सन्तोषी मात।\nअपने सेवक जनन की सुख-सम्पत्ति दात॥",
    { en: "Victory to Mother Santoshi — giver of joy and prosperity to your devotees." },
    ["Santoṣī Mātā Vratakathā", "Santoṣī Mātā Ārtī", "Santoṣī Mātā Aṣṭakam"],
    ["Santoṣī", "Sukhadā", "Śāntipradā", "Tuṣṭi", "Puṣṭi", "Maṅgalā"],
    [],
    IMGX.santoshi
  ),
  // 21. Vishwakarma (Divine Architect)
  dx("vishwakarma",
    { en: "Vishwakarma", te: "విశ్వకర్మ", hi: "विश्वकर्मा", ta: "விசுவகர்மா", sa: "विश्वकर्मा" },
    "#0369A1",
    { sa: "ॐ विश्वकर्मणे नमः", en: "Om Viśvakarmaṇe Namaḥ", meaning: { en: "Salutations to Vishwakarma, the divine architect of the universe.", te: "సర్వ శిల్పకర్త విశ్వకర్మకు నమస్కారం.", hi: "सृष्टि के दिव्य शिल्पी विश्वकर्मा को नमन।", ta: "பிரபஞ்ச சிற்பியான விசுவகர்மாவுக்கு நமஸ்காரம்." } },
    "विश्वकर्मन् नमस्तुभ्यं विश्वात्मन् विश्वसंभव।\nअपमृत्युविनाशाय सर्वकार्यकराय च॥",
    { en: "Salutations to Vishwakarma, soul of the universe, origin of all — remover of untimely death, accomplisher of every task." },
    ["Viśvakarma Stotram", "Viśvakarma Aṣṭakam", "Viśvakarma Kavacham", "Viśvakarma Aṣṭottara"],
    ["Viśvakarmā", "Tvaṣṭā", "Śilpi-nātha", "Devaśilpī", "Vardhaki", "Kalākāra", "Sarva-kāraka", "Yajña-svarūpī", "Pañca-mukha", "Prajāpati-suta"],
    [],
    IMGX.vishwakarma
  ),
  // 22. Veerabrahmendra Swamy (Andhra saint — Kalajnana)
  dx("veerabrahmendra",
    { en: "Veerabrahmendra Swamy", te: "పోతులూరి వీరబ్రహ్మేంద్ర స్వామి", hi: "वीरब्रह्मेन्द्र स्वामी", ta: "வீரப்ரம்ஹேந்திர சுவாமி", sa: "वीरब्रह्मेन्द्रस्वामी" },
    "#A16207",
    { sa: "ॐ श्रीवीरब्रह्मेन्द्रस्वामिने नमः", en: "Om Śrī Vīrabrahmendra Svāmine Namaḥ", meaning: { en: "Salutations to Sri Veerabrahmendra Swamy of Kandimallayapalle, prophet of the Kalajnana.", te: "కందిమల్లయ్యపల్లె వాసుడు, కాలజ్ఞాన ప్రవర్తకుడైన శ్రీ వీరబ్రహ్మేంద్ర స్వామికి నమస్కారం.", hi: "कालज्ञान के प्रवर्तक कंडिमल्लयपल्ले वासी वीरब्रह्मेन्द्र स्वामी को नमन।", ta: "காலஞானத்தை உணர்த்திய கண்டிமல்லய்யபல்லெ வாசி வீரப்ரம்ஹேந்திர சுவாமிக்கு நமஸ்காரம்." } },
    "कालज्ञानप्रदातारं ब्रह्मज्ञानमहोदयम्।\nपोतुलूरिकुले जातं वीरब्रह्मेन्द्रमाश्रये॥",
    { en: "Bestower of Kalajnana (knowledge of time), rising sun of Brahma-wisdom, born in the Poturi lineage — I take refuge in Veerabrahmendra Swamy." },
    ["Kālajñānam (Prophecies)", "Śrī Vīrabrahmendra Stotram", "Vīrabrahmendra Aṣṭakam", "Kāndimallayapalle Mahima"],
    ["Vīrabrahmendra", "Poturi-vaṁśa-jāta", "Kālajñānī", "Brahmajñānī", "Jaganmohana-Rāma", "Siddha-Puruṣa", "Kāṇḍimallayapalle-vāsi", "Govindāmba-priya", "Yogīśvara", "Guru-mūrti"],
    [],
    IMGX.veerabrahmendra
  ),
];
