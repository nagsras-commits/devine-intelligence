// Authentic Nitya Pooja Vidhanam (Telugu tradition) — content provided by devotee.
// Each step has: id, title (per lang), instructions_te (verbatim Telugu), instructions_en (translation),
// sanskrit (mantra in Devanagari), translit_te (Telugu), translit_en (IAST).
// Sankalpam uses dynamic Panchangam values via `{{samvatsara}}`, `{{ayana}}`, `{{ruthu}}`, `{{masa}}`, `{{paksha}}`, `{{tithi}}`, `{{vara}}`.

export const AUTHENTIC_POOJA = {
  intro_te: "ముందుగా కుంకుమ బొట్టు పెట్టుకుని, నమస్కరించుకుని, ఈ విధంగా ప్రార్ధించుకోవాలి.",
  intro_en: "First apply kumkum tilak, make a namaskaram, and pray as follows.",
  steps: [
    {
      id: "prarthana",
      icon: "Sparkles",
      title: { en: "Prārthanā — Opening Prayer", te: "ప్రార్థన", hi: "प्रार्थना", ta: "பிரார்த்தனை" },
      instructions: {
        te: "ముందుగా కుంకుమ బొట్టు పెట్టుకుని, నమస్కరించుకుని ఈ శ్లోకం చెప్పాలి.",
        en: "Apply kumkum tilak, make a namaskaram, and recite this śloka.",
        hi: "कुंकुम तिलक लगाकर नमस्कार करते हुए यह श्लोक बोलें।",
        ta: "குங்குமப் பொட்டு இட்டு, நமஸ்காரம் செய்து இந்த ஸ்லோகத்தை சொல்லவும்.",
      },
      sanskrit: "शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् |\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ||\nअयं मुहूर्तः सुमुहूर्तोऽस्तु ||",
      translit: {
        te: "శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజం |\nప్రసన్న వదనం ధ్యాయేత్ సర్వ విఘ్నోపశాంతయే ||\nఅయం ముహూర్తస్సుముహూర్తోస్తు ||",
        en: "Śuklāmbara-dharaṁ Viṣṇuṁ śaśi-varṇaṁ catur-bhujam |\nPrasanna-vadanaṁ dhyāyet sarva-vighnopaśāntaye ||\nAyaṁ muhūrtaḥ sumuhūrtoʼstu ||",
        hi: "शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् |\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ||",
        ta: "சுக்லாம்பரதரம் விஷ்ணும் சசிவர்ணம் சதுர்புஜம் |\nப்ரஸந்நவதநம் த்யாயேத் ஸர்வவிக்நோபசாந்தயே ||",
      },
    },
    {
      id: "achamanam",
      icon: "Droplet",
      title: { en: "Ācamanam", te: "ఆచమనం", hi: "आचमन", ta: "ஆசமநம்" },
      instructions: {
        te: "ఎడమచేతితో ఉద్ధరిణ పట్టుకుని, నీటి పాత్ర నుంచి నీటిని కుడి చేతిలో పోసుకొని 'హస్తం ప్రక్షాళ్య' అంటూ ప్లేటులో వదిలి పెట్టండి. మళ్లీ మూడుసార్లు విడివిడిగా నీటిని కుడి చేతిలో వేసుకుంటూ కేశవాయ స్వాహా, నారాయణాయ స్వాహా, మాధవాయ స్వాహా అంటూ నీటిని తాగండి. తరువాత 'గోవిందాయ నమః' అంటూ నీటిని ప్లేట్ లో వదిలి పెట్టండి. తరువాత ఈ 21 నామాలు చెప్పుకోవాలి.",
        en: "Hold the uddharaṇi in the left hand. First pour water into the right palm and release into a plate saying 'hastaṁ prakṣālya'. Then three times take water into the right palm and sip while saying Keśavāya Svāhā, Nārāyaṇāya Svāhā, Mādhavāya Svāhā. Then say 'Govindāya Namaḥ' and release the water into the plate. Then recite these 21 names.",
        hi: "उद्धरणी बाएँ हाथ में, दाहिनी हथेली में जल लेकर पहले 'हस्तं प्रक्षाळ्य' कहते हुए थाली में छोड़ें। फिर तीन बार केशवाय स्वाहा, नारायणाय स्वाहा, माधवाय स्वाहा कहते हुए जल आचमन करें। पश्चात् 'गोविन्दाय नमः' कहकर जल थाली में छोड़ें एवं २१ नाम बोलें।",
        ta: "உத்தரணியை இடது கையில் பிடித்து, வலது உள்ளங்கையில் நீரெடுத்து 'ஹஸ்தம் ப்ரக்ஷாள்ய' என்று தட்டில் விடவும். பின் மூன்று முறை கேசவாய ஸ்வாஹா, நாராயணாய ஸ்வாஹா, மாதவாய ஸ்வாஹா என்று அருந்தவும். பின் 'கோவிந்தாய நம:' என்று நீரை விட்டு 21 நாமங்கள் சொல்லவும்.",
      },
      sanskrit: "ॐ केशवाय स्वाहा | ॐ नारायणाय स्वाहा | ॐ माधवाय स्वाहा |\nॐ गोविन्दाय नमः | विष्णवे नमः | मधुसूदनाय नमः | त्रिविक्रमाय नमः |\nवामनाय नमः | श्रीधराय नमः | हृषीकेशाय नमः | पद्मनाभाय नमः |\nदामोदराय नमः | सङ्कर्षणाय नमः | वासुदेवाय नमः | प्रद्युम्नाय नमः |\nअनिरुद्धाय नमः | पुरुषोत्तमाय नमः | अधोक्षजाय नमः | नारसिंहाय नमः |\nअच्युताय नमः | जनार्दनाय नमः | उपेन्द्राय नमः | हरये नमः | श्रीकृष्णाय नमः ||",
      translit: {
        te: "ఓం కేశవాయ స్వాహా | ఓం నారాయణాయ స్వాహా | ఓం మాధవాయ స్వాహా |\nగోవిందాయ నమః | విష్ణవే నమః | మధుసూదనాయ నమః | త్రివిక్రమాయ నమః | వామనాయ నమః | శ్రీధరాయ నమః | హృషీకేశాయ నమః | పద్మనాభాయ నమః | దామోదరాయ నమః | సంకర్షణాయ నమః | వాసుదేవాయ నమః | ప్రద్యుమ్నాయ నమః | అనిరుద్ధాయ నమః | పురుషోత్తమాయ నమః | అధోక్షజాయ నమః | నారసింహాయ నమః | అచ్యుతాయ నమః | జనార్దనాయ నమః | ఉపేంద్రాయ నమః | హరయే నమః | శ్రీ కృష్ణాయ నమః ||",
        en: "Om Keśavāya Svāhā | Om Nārāyaṇāya Svāhā | Om Mādhavāya Svāhā |\nGovindāya Namaḥ | Viṣṇave Namaḥ | Madhusūdanāya Namaḥ | Trivikramāya Namaḥ | Vāmanāya Namaḥ | Śrīdharāya Namaḥ | Hṛṣīkeśāya Namaḥ | Padmanābhāya Namaḥ | Dāmodarāya Namaḥ | Saṅkarṣaṇāya Namaḥ | Vāsudevāya Namaḥ | Pradyumnāya Namaḥ | Aniruddhāya Namaḥ | Puruṣottamāya Namaḥ | Adhokṣajāya Namaḥ | Nārasiṁhāya Namaḥ | Acyutāya Namaḥ | Janārdanāya Namaḥ | Upendrāya Namaḥ | Haraye Namaḥ | Śrī Kṛṣṇāya Namaḥ ||",
      },
    },
    {
      id: "bhutashuddhi",
      icon: "Wind",
      title: { en: "Bhūta-śuddhi & Prāṇāyāma", te: "భూతోచ్చాటన & ప్రాణాయామం", hi: "भूतोच्चाटन एवं प्राणायाम", ta: "பூதோச்சாடநம் & ப்ராணாயாமம்" },
      instructions: {
        te: "అక్షింతలు తీసుకొని 'ఉత్తిష్ఠంతు…' మంత్రం చెప్పి వాసన చూసి ఎడమ వైపుగా వెనక్కి వేసుకోండి. తరువాత బొటనవేలు, మధ్యవేలు, ఉంగరం వేలు — మూడు కలిపి ముక్కు పట్టుకొని ప్రాణాయామం చేస్తూ మంత్రం చెప్పండి. తరువాత ముక్కు వదిలివేయండి.",
        en: "Take akshata, recite the 'Uttiṣṭhantu bhūta-piśācāḥ…' mantra, smell them, and throw them behind you over your left shoulder. Then hold the nose with thumb, middle and ring fingers and perform prāṇāyāma while reciting the Vyāhṛti + Gāyatrī, then release the nose.",
        hi: "अक्षत लेकर 'उत्तिष्ठन्तु भूत-पिशाचाः…' मन्त्र पढ़ें, सूँघकर बाएँ कंधे के पीछे फेंकें। पश्चात् अंगूठा, मध्यमा व अनामिका से नाक बंद करके प्राणायाम करते हुए मन्त्र बोलें, फिर छोड़ें।",
        ta: "அக்ஷதை எடுத்து 'உத்திஷ்டந்து…' மந்திரம் சொல்லி முகர்ந்து இடது தோள் பின்னால் எறியவும். பின் கட்டைவிரல், நடுவிரல், மோதிரவிரல் மூன்றால் நாசியை மூடி பிராணாயாமம் செய்யவும்.",
      },
      sanskrit: "उत्तिष्ठन्तु भूत पिशाचाः एते भूमि भारकाः |\nएतेषामविरोधेन ब्रह्मकर्म समारभे ||\nॐ भूर्भुवस्सुवः दैवी गायत्री छन्दः प्राणायामे विनियोगः |\nॐ भूः | ॐ भुवः | ॐ सुवः | ॐ महः | ॐ जनः | ॐ तपः | ॐ ग्ं सत्यम् |\nॐ तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् |\nॐ आपो ज्योतिः रसोमृतं ब्रह्म भूर्भुवस्सुवरोम् ||",
      translit: {
        te: "ఉత్తిష్ఠంతు భూత పిశాచాః ఏతే భూమి భారకాః |\nఏతేషామ విరోధేన బ్రహ్మకర్మ సమారభే || ఓం భూర్భువస్సువః దైవీ గాయత్రీ ఛందః ప్రాణాయామే వినియోగః |\nఓం భూః, ఓం భువః, ఓం సువః, ఓం మహః, ఓం జనః, ఓం తపః, ఓగ్ మ్ సత్యం |\nఓం తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి ధియో యో నః ప్రచోదయాత్ |\nఓం ఆపో జ్యోతీ రసోమృతం బ్రహ్మ భూర్భువస్సువరోమ్ ||",
        en: "Uttiṣṭhantu bhūta-piśācāḥ ete bhūmi-bhārakāḥ | eteṣām-avirodhena brahma-karma samārabhe || Om Bhūrbhuvassuvaḥ Daivī Gāyatrī chandaḥ prāṇāyāme viniyogaḥ | Om Bhūḥ, Om Bhuvaḥ, Om Suvaḥ, Om Mahaḥ, Om Janaḥ, Om Tapaḥ, Om Sm Satyam | Om Tat Savitur Vareṇyaṁ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt | Om Āpo Jyotī Rasomṛtaṁ Brahma Bhūrbhuvassuvarom ||",
      },
    },
    {
      id: "sankalpam",
      icon: "Anchor",
      title: { en: "Saṅkalpam (auto-filled from today's Panchāṅgam)", te: "సంకల్పం (నేటి పంచాంగం నుండి)", hi: "संकल्प (आज के पञ्चाङ्ग से)", ta: "ஸங்கல்பம் (இன்றைய பஞ்சாங்கம்)" },
      instructions: {
        te: "అక్షింతలు చేతిలోకి తీసుకొని ఈ సంకల్పం చెప్పుకోండి. మంత్రం చెప్పిన తరువాత చేతిలో అక్షింతలు, నీళ్లు పోసుకొని ప్లేటులో వదిలిపెట్టండి. (శ్రీశైలానికి ఏ దిక్కులో వుంటే ఆ దిక్కు, మీ గోత్రం, పేర్లు, ఇష్టదేవత పేర్లు మీరు నింపండి.)",
        en: "Take akshata into your right palm and utter this Sankalpam. After finishing the mantra, pour water on the akshata in your hand and release into the plate. (Fill in your direction from Srisailam, gotra, names, and Ishta devata names.)",
        hi: "दाहिनी हथेली में अक्षत लेकर संकल्प बोलें। पूर्ण होने पर अक्षत में जल डालकर थाली में छोड़ें। (श्रीशैल से दिशा, गोत्र व नाम स्वयं भरें।)",
        ta: "வலது உள்ளங்கையில் அக்ஷதை எடுத்து சங்கல்பம் சொல்லவும். முடிந்த பின் நீர் ஊற்றி தட்டில் விடவும். (ஸ்ரீசைலத்திலிருந்து திசை, கோத்திரம், பெயர் — நீங்களே நிரப்பவும்.)",
      },
      // Sankalpam has dynamic placeholders that get replaced with today's panchangam values.
      sankalpam_te: `ఓం || మమోపాత్త దురితక్షయద్వారా శ్రీ పరమేశ్వర ప్రీత్యర్థం, శుభే శోభనే ముహూర్తే
అద్య బ్రహ్మణః ద్వితీయ పరార్ధే శ్వేత వరాహ కల్పే వైవస్వత మన్వంతరే, అష్టావింశతి తమే, కలియుగే, ప్రథమ పాదే,
జంబూద్వీపే, భరత వర్షే, భరత ఖండే, మేరోః దక్షిణ దిగ్భాగే, శ్రీశైలస్య [.....] ప్రదేశే,
అస్మిన్ వర్తమాన వ్యావహారిక చాంద్రమానేన శ్రీ {{samvatsara}} నామ సంవత్సరే,
{{ayana}}, {{ruthu}} ఋతౌ, {{masa}} మాసే, {{paksha}} పక్షే, {{tithi}} శుభ తిథౌ, {{vara}} శుభ వాసరే,
శుభ నక్షత్ర, శుభ యోగ, శుభ కరణ ఏవం గుణ విశేషణ విశిష్టాయాం, శుభ తిథౌ,
శ్రీమాన్ శ్రీమతః [.....] గోత్రః [.....] నామధేయః,
అస్మాకం సహ కుటుంబానాం క్షేమ స్థైర్య విజయ అభయ ఆయుః ఆరోగ్య ఐశ్వర్య అభివృద్ధ్యర్థం,
ధర్మార్థ కామ మోక్ష చతుర్విధ ఫల పురుషార్థ సిద్ధ్యర్థం, ఇష్ట కామ్యార్థ సిద్ధ్యర్థం, మనో వాంఛా ఫల సిద్ధ్యర్థం,
సమస్త దురితోపశాంత్యర్థం, సమస్త మంగళావాప్త్యర్థం,
శ్రీ మహా గణాధిపతి [ఇష్టదేవత] పూజాం కరిష్యే ||`,
      sankalpam_en: `Om || Mama upātta durita-kṣaya-dvārā Śrī Parameśvara prītyarthaṁ, śubhe śobhane muhūrte,
Adya Brahmaṇaḥ dvitīya parārdhe Śveta-varāha kalpe Vaivasvata manvantare, aṣṭāviṁśatitame, Kali-yuge, prathama-pāde,
Jambūdvīpe, Bharata-varṣe, Bharata-khaṇḍe, Meror-dakṣiṇa dig-bhāge, Śrīśailasya [.....] pradeśe,
asmin vartamāna vyāvahārika Cāndra-mānena Śrī {{samvatsara}} nāma saṁvatsare,
{{ayana}}, {{ruthu}} ṛtau, {{masa}} māse, {{paksha}} pakṣe, {{tithi}} śubha tithau, {{vara}} śubha vāsare,
śubha-nakṣatra śubha-yoga śubha-karaṇa evaṁ-guṇa-viśeṣaṇa-viśiṣṭāyāṁ, śubha-tithau,
Śrīmān Śrīmataḥ [.....] gotraḥ [.....] nāma-dheyaḥ,
asmākaṁ saha kuṭumbānāṁ kṣema-sthairya-vijaya-abhaya-āyuḥ-ārogya-aiśvarya-abhivṛddhy-arthaṁ,
dharma-artha-kāma-mokṣa catur-vidha phala-puruṣārtha-siddhy-arthaṁ, iṣṭa-kāmyārtha-siddhy-arthaṁ, mano-vāñchā-phala-siddhy-arthaṁ,
samasta duritopa-śāntyarthaṁ, samasta maṅgalāvāptyarthaṁ,
Śrī Mahā-Gaṇādhipati [Iṣṭa Devatā] pūjāṁ kariṣye ||`,
    },
    {
      id: "deeparadhana",
      icon: "Flame",
      title: { en: "Dīpārādhana — Lighting the Lamp", te: "దీపారాధన", hi: "दीपाराधन", ta: "தீபாராதனை" },
      instructions: {
        te: "క్రింది మంత్రం చెపుతూ దీపారాధన చేయండి. వెలిగించిన దీపానికి గంధం, కుంకుమ బొట్టు పెట్టి, ఒక పుష్పం, అక్షింతలు వేసి, దీపానికి నమస్కారం చేయండి.",
        en: "Light the lamp reciting the mantra below. Apply sandal and kumkum on the lamp, offer a flower and akshata, and namaskaram.",
        hi: "मन्त्र बोलते हुए दीप प्रज्वलित करें। दीप पर चन्दन-कुंकुम लगाकर पुष्प व अक्षत अर्पित करें, फिर नमस्कार करें।",
        ta: "மந்திரம் சொல்லி விளக்கு ஏற்றவும். சந்தனம், குங்குமம் இட்டு பூ, அக்ஷதை அர்ப்பணித்து நமஸ்காரம் செய்யவும்.",
      },
      sanskrit: "ॐ उद्दीप्यस्व जातवेदः अपघ्नन् निर्ऋतिं मम |\nपशूगं्श्च मह्यमावह जीवनं च दिशोदिश ||",
      translit: {
        te: "ఓం ఉద్దీప్య స్వ జాతవేదో పఘ్నం నిరృతిం మమ |\nపశూగ్ శ్చ, మహ్యమావహ జీవనం చ దిశోదిశ ||",
        en: "Om Uddīpyasva Jātavedaḥ apaghnan nirṛtiṁ mama | Paśūgṁśca mahyam-āvaha jīvanaṁ ca diśodiśa ||",
      },
    },
    {
      id: "kalasha",
      icon: "GlassWater",
      title: { en: "Kalaśa Pūjā", te: "కలశ పూజ", hi: "कलश पूजा", ta: "கலச பூஜை" },
      instructions: {
        te: "ఆచమనం చేసిన పాత్ర కాకుండా విడిగా ఇంకొక పాత్రలో నీళ్లు పెట్టుకోండి. ఆ పాత్రకి గంధం, కుంకుమ బొట్టు పెట్టి, పుష్పం అక్షింతలు వేసి, చేయి ఉంచి క్రింది మంత్రం చెప్పండి. పుష్పాన్ని నీటిలో సవ్య (గడియార దిశలో) తిప్పండి.",
        en: "Take a separate vessel of water (not the achamana vessel). Apply sandal and kumkum on it, drop a flower and akshata, place your right hand on top and recite the mantra. Rotate the flower clockwise in the water.",
        hi: "आचमन-पात्र से अलग एक पात्र में जल भरें। पात्र पर चन्दन-कुंकुम लगाकर पुष्प व अक्षत डालें, दाहिना हाथ ऊपर रखकर मन्त्र बोलें। पुष्प को जल में दक्षिणावर्त घुमाएँ।",
        ta: "ஆசமன பாத்திரம் அல்லாத தனிப்பட்ட பாத்திரத்தில் நீர். அதில் சந்தனம், குங்குமம், பூ, அக்ஷதை இட்டு வலது கை வைத்து மந்திரம் சொல்லவும். பூவை நீரில் வலமாக சுற்றவும்.",
      },
      sanskrit: "कलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः |\nमूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ||\nकुक्षौ तु सागरास्सर्वे सप्तद्वीपा वसुन्धरा |\nऋग्वेदोऽथ यजुर्वेदः सामवेदो ह्यथर्वणः ||\nअङ्गैश्च सहितास्सर्वे कलशाम्बु समाश्रिताः |\nआयान्तु देवपूजार्थं दुरितक्षयकारकाः ||\nगङ्गे च यमुने चैव गोदावरि सरस्वति |\nनर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ||",
      translit: {
        te: "కలశస్య ముఖే విష్ణుః కంఠే రుద్ర సమాశ్రితః |\nమూలే తత్ర స్థితో బ్రహ్మా మధ్యే మాతృగణాః స్మృతాః ||\nకుక్షౌ తు సాగరాస్సర్వే సప్తద్వీపా వసుంధరా |\nఋగ్వేదోథ యజుర్వేదస్సామవేదో హ్యథర్వణః ||\nఅంగైశ్చ సహితాస్సర్వే కలశాంబు సమాశ్రితాః | ఆయాంతు దేవపూజార్థం దురితక్షయకారకాః ||\nగంగే చ యమునే చైవ గోదావరి సరస్వతీ | నర్మదే సింధు కావేరీ జలేస్మిన్ సన్నిధిం కురు ||",
        en: "Kalaśasya mukhe Viṣṇuḥ kaṇṭhe Rudraḥ samāśritaḥ | mūle tatra sthito Brahmā madhye mātṛ-gaṇāḥ smṛtāḥ || kukṣau tu sāgarās-sarve sapta-dvīpā vasundharā | Ṛg-vedo'tha Yajur-vedaḥ Sāma-vedo hy-atharvaṇaḥ || aṅgaiśca sahitās-sarve kalaśāmbu samāśritāḥ | āyāntu deva-pūjārthaṁ durita-kṣaya-kārakāḥ || Gaṅge ca Yamune caiva Godāvari Sarasvati | Narmade Sindhu Kāveri jale'smin sannidhiṁ kuru ||",
      },
      addendum: {
        te: "కలశోదకేన పూజాద్రవ్యాణి దేవం ఆత్మానం చ సంప్రోక్ష్య — కలశంలోని నీటిని పూజా ద్రవ్యముల మీద, దైవం మీద, తమ మీద కొద్దిగా చిలకరించుకోండి.",
        en: "Sprinkle the kalaśa water lightly over the pooja materials, the deity, and yourself.",
      },
    },
    {
      id: "ganesha-invocation",
      icon: "Star",
      title: { en: "Gaṇeśa Vandanam", te: "గణేశ వందనం", hi: "गणेश वंदन", ta: "கணேச வந்தநம்" },
      instructions: {
        te: "పుష్పం, అక్షింతలు చేతిలో పట్టుకొని ఈ శ్లోకం చెప్పి స్వామి వారి వద్ద వేసి నమస్కారం చేయండి.",
        en: "Hold a flower and akshata, recite the śloka, offer to the deity, and namaskaram.",
        hi: "पुष्प व अक्षत हाथ में लेकर श्लोक पढ़कर देवता के समक्ष रखें, नमस्कार करें।",
        ta: "பூவும் அக்ஷதையும் கையில் பிடித்து ஸ்லோகம் சொல்லி தேவரின் முன் வைத்து நமஸ்காரம் செய்யவும்.",
      },
      sanskrit: "वक्रतुण्ड महाकाय कोटिसूर्य समप्रभ |\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ||",
      translit: {
        te: "వక్రతుండ మహాకాయ కోటిసూర్య సమప్రభ |\nనిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా ||",
        en: "Vakratuṇḍa mahā-kāya koṭi-sūrya samaprabha | Nirvighnaṁ kuru me deva sarva-kāryeṣu sarvadā ||",
      },
    },
    {
      id: "dhyana-avahana",
      icon: "UserPlus",
      title: { en: "Dhyāna • Āvāhana • Āsana", te: "ధ్యానం • ఆవాహన • ఆసనం", hi: "ध्यान • आवाहन • आसन", ta: "தியானம் • ஆவாஹனம் • ஆஸநம்" },
      instructions: {
        te: "అక్షింతలు తీసుకొని క్రింది మంత్రాలు విడివిడిగా మూడు సార్లు చెపుతూ స్వామివారి మీద వేయండి.",
        en: "Take akshata and offer three times over the deity while reciting these three lines.",
        hi: "अक्षत लेकर तीन बार ये मन्त्र बोलते हुए देवता पर अर्पित करें।",
        ta: "அக்ஷதை எடுத்து மும்முறை ஸமர்ப்பிக்கவும்.",
      },
      sanskrit: "श्री महा गणाधिपतये नमः | ध्यायामि ध्यानं समर्पयामि ||\nश्री महा गणाधिपतये नमः | आवाहयामि आसनं समर्पयामि ||\nश्री महा गणाधिपतये नमः | नवरत्न खचित सिंहासनं समर्पयामि ||",
      translit: {
        te: "శ్రీ మహా గణాధిపతయే నమః | ధ్యాయామి ధ్యానం సమర్పయామి ||\nశ్రీ మహా గణాధిపతయే నమః | ఆవాహయామి ఆసనం సమర్పయామి ||\nశ్రీ మహా గణాధిపతయే నమః | నవరత్న ఖచిత సింహాసనం సమర్పయామి ||",
        en: "Śrī Mahā-Gaṇādhipataye Namaḥ | Dhyāyāmi dhyānaṁ samarpayāmi ||\nŚrī Mahā-Gaṇādhipataye Namaḥ | Āvāhayāmi āsanaṁ samarpayāmi ||\nŚrī Mahā-Gaṇādhipataye Namaḥ | Nava-ratna khacita siṁhāsanaṁ samarpayāmi ||",
      },
    },
    {
      id: "padya-arghya-achamana",
      icon: "Hand",
      title: { en: "Pādyam • Arghyam • Ācamanīyam", te: "పాద్యం • అర్ఘ్యం • ఆచమనీయం", hi: "पाद्य • अर्घ्य • आचमनीय", ta: "பாத்யம் • அர்க்யம் • ஆசமநீயம்" },
      instructions: {
        te: "కలశంలోని నీటిని ఉద్ధరిణతో మూడు సార్లు స్వామివారికి చూపిస్తూ ప్లేటులో వేయండి — పాదాలకు, హస్తాలకు, ముఖానికి.",
        en: "Show water from the kalaśa with the uddharaṇi three times to the deity — for feet, hands, and mouth — releasing into the plate.",
        hi: "उद्धरणी से जल तीन बार दिखाकर थाली में छोड़ें — पाद्य, अर्घ्य, आचमनीय।",
        ta: "உத்தரணியால் நீரை மும்முறை காட்டி தட்டில் விடவும் — பாதம், கை, முகம்.",
      },
      sanskrit: "श्री महा गणाधिपतये नमः | पादयोः पाद्यं समर्पयामि ||\nश्री महा गणाधिपतये नमः | हस्तयोः अर्घ्यं समर्पयामि ||\nश्री महा गणाधिपतये नमः | मुखे शुद्ध आचमनीयं समर्पयामि ||",
      translit: {
        te: "శ్రీ మహా గణాధిపతయే నమః | పాదయోః పాద్యం సమర్పయామి ||\nశ్రీ మహా గణాధిపతయే నమః | హస్తయోః అర్ఘ్యం సమర్పయామి ||\nశ్రీ మహా గణాధిపతయే నమః | ముఖే శుద్ధ ఆచమనీయం సమర్పయామి ||",
        en: "Śrī Mahā-Gaṇādhipataye Namaḥ | Pādayoḥ pādyaṁ samarpayāmi || Hastayoḥ arghyaṁ samarpayāmi || Mukhe śuddha ācamanīyaṁ samarpayāmi ||",
      },
    },
    {
      id: "snanam",
      icon: "Droplets",
      title: { en: "Snānam — Sacred Bath", te: "స్నానం", hi: "स्नान", ta: "ஸ்நாநம்" },
      instructions: {
        te: "కలశంలోని పుష్పంతో నీటిని తీసుకొని క్రింది శ్లోకం చెప్పుతూ చిన్నగా దేవుళ్ళ మీద చల్లండి, తరువాత శుద్ధాచమనీయం అర్పించండి.",
        en: "With the flower from the kalasha, sprinkle water lightly over the deity while reciting the śloka; then offer shuddhāchamanīyam.",
      },
      sanskrit: "नदीनां चैव सर्वासां आनीतं निर्मलोदकम् |\nस्नानं स्वीकुरु देवेश मया दत्तं सुरेश्वर ||\nश्री महा गणाधिपतये नमः | शुद्धोदक स्नानं समर्पयामि | स्नानानन्तरं शुद्ध आचमनीयं समर्पयामि ||",
      translit: {
        te: "నదీనాం చైవ సర్వాసా మానీతం నిర్మలోదకం |\nస్నానం స్వీకురు దేవేశ మయాదత్తం సురేశ్వర ||\nశ్రీ మహా గణాధిపతయే నమః | శుద్ధోదక స్నానం సమర్పయామి | స్నానానంతరం శుద్ధ ఆచమన్యం సమర్పయామి ||",
        en: "Nadīnāṁ caiva sarvāsāṁ ānītaṁ nirmalodakam | Snānaṁ svīkuru Deveśa mayā dattaṁ Sureśvara || Śuddhodaka snānaṁ samarpayāmi | Snānānantaraṁ śuddha ācamanīyaṁ samarpayāmi ||",
      },
    },
    {
      id: "vastra",
      icon: "Shirt",
      title: { en: "Vastra-yugmam — Two Garments", te: "వస్త్రయుగ్మం", hi: "वस्त्रयुग्म", ta: "வஸ்திரயுக்மம்" },
      instructions: {
        te: "పుష్పం, అక్షింతలు చేతిలో పట్టుకొని శ్లోకం చెప్పి స్వామివారి మీద వేయండి.",
        en: "Hold flower and akshata, recite the śloka, and offer to the deity.",
      },
      sanskrit: "वस्त्रयुग्मं सदा शुभ्रं मनोहर विधं शुभम् |\nददामि देव देवेश भक्त्येदं प्रतिगृह्यताम् ||\nवस्त्रयुग्मं समर्पयामि ||",
      translit: {
        te: "వస్త్రయుగ్మం సదా శుభ్రం, మనోహర విధం శుభం |\nదదామి దేవ దేవేశ, భక్త్యేదం ప్రతిగృహ్యతాం ||\nవస్త్రయుగ్మం సమర్పయామి ||",
        en: "Vastra-yugmaṁ sadā śubhraṁ manohara vidhaṁ śubham | Dadāmi Deva-deveśa bhaktyedaṁ pratigṛhyatām || Vastra-yugmaṁ samarpayāmi ||",
      },
    },
    {
      id: "yagnopavitam",
      icon: "Ribbon",
      title: { en: "Yajñopavītam", te: "యజ్ఞోపవీతం", hi: "यज्ञोपवीत", ta: "யஜ்ஞோபவீதம்" },
      instructions: {
        te: "పుష్పం, అక్షింతలు చేతిలో పట్టుకొని శ్లోకం చెప్పి స్వామివారి మీద వేయండి.",
        en: "Hold flower and akshata, recite the śloka, and offer to the deity.",
      },
      sanskrit: "राजितं ब्रह्मसूत्रं च काञ्चनं चोत्तरीयकम् |\nगृहाण देव सर्वज्ञ भक्तानाम् इष्टदायक ||\nयज्ञोपवीतं समर्पयामि ||",
      translit: {
        te: "రాజితం బ్రహ్మసూత్రంచ కాంచనం చోత్తరీయకమ్ |\nగృహాణదేవ సర్వజ్ఞ భక్తానామిష్టదాయక |\nయజ్ఞోపవీతం సమర్పయామి ||",
        en: "Rājitaṁ brahma-sūtraṁ ca kāñcanaṁ cottarīyakam | Gṛhāṇa deva sarva-jña bhaktānām-iṣṭa-dāyaka | Yajñopavītaṁ samarpayāmi ||",
      },
    },
    {
      id: "gandham",
      icon: "Sparkles",
      title: { en: "Gandham — Sandal Paste", te: "గంధం", hi: "गन्ध", ta: "கந்தம்" },
      instructions: {
        te: "ఒక పుష్పాన్ని గంధంలో అద్ది శ్లోకం చెప్పి స్వామివారి వద్ద పెట్టండి.",
        en: "Dip a flower in sandal paste and, reciting the śloka, place it near the deity.",
      },
      sanskrit: "चन्दनागरु कर्पूर कस्तूरी कुङ्कुमान्वितम् |\nविलेपनं सुरश्रेष्ठ प्रीत्यर्थं प्रतिगृह्यताम् ||\nगन्धं समर्पयामि ||",
      translit: {
        te: "చందనాగరు కర్పూర కస్తూరీ కుంకుమాన్వితం |\nవిలేపనం సురశ్రేష్ఠ ప్రీత్యర్థం ప్రతిగృహ్యతామ్ |\nగంధం సమర్పయామి ||",
        en: "Candanāgaru karpūra kastūrī kuṅkumānvitam | Vilepanaṁ sura-śreṣṭha prītyarthaṁ pratigṛhyatām | Gandhaṁ samarpayāmi ||",
      },
    },
    {
      id: "akshatan",
      icon: "Wheat",
      title: { en: "Akṣatān — Sacred Rice", te: "అక్షతలు", hi: "अक्षत", ta: "அக்ஷதை" },
      instructions: {
        te: "అక్షింతలు చేతిలో పట్టుకొని శ్లోకం చెప్పి స్వామివారి మీద వేయండి.",
        en: "Take akshata, recite the śloka, and offer over the deity.",
      },
      sanskrit: "अक्षतान् धवलान् दिव्यान् शालीयान् तण्डुलान् शुभान् |\nगृहाण परमानन्द सर्वदेव नमोऽस्तु ते ||\nअक्षतान् समर्पयामि ||",
      translit: {
        te: "అక్షతాన్ ధవళాన్ దివ్యాన్ శాలీయాన్ తండులాన్ శుభాన్ |\nగృహాణ పరమానంద సర్వదేవ నమోస్తుతే |\nఅక్షతాన్ సమర్పయామి ||",
        en: "Akṣatān dhavalān divyān śālīyān taṇḍulān śubhān | Gṛhāṇa paramānanda sarva-deva namo'stu te | Akṣatān samarpayāmi ||",
      },
    },
    {
      id: "ashtottara",
      icon: "Flower2",
      title: { en: "Gaṇeśa Ṣoḍaśa-nāma Archana (16 Names)", te: "గణేశ షోడశ-నామ అర్చన", hi: "गणेश षोडश-नाम अर्चन", ta: "கணேச ஷோடச நாம அர்ச்சனை" },
      instructions: {
        te: "అక్షింతలు / పుష్పాలతో ప్రతి నామంతో ఒకసారి స్వామివారిపై అర్చించండి. మీ ఇష్టదేవత అష్టోత్తరాన్ని కూడా ఇలానే చెప్పుకోవచ్చు.",
        en: "Offer a flower or akshata with each name. You can similarly recite your Iṣṭa Devatā's ashtottara.",
      },
      sanskrit: "ॐ सुमुखाय नमः | ॐ एकदन्ताय नमः | ॐ कपिलाय नमः | ॐ गजकर्णकाय नमः |\nॐ लम्बोदराय नमः | ॐ विकटाय नमः | ॐ विघ्नराजाय नमः | ॐ गणाधिपाय नमः |\nॐ धूम्रकेतवे नमः | ॐ गणाध्यक्षाय नमः | ॐ फालचन्द्राय नमः | ॐ गजाननाय नमः |\nॐ वक्रतुण्डाय नमः | ॐ शूर्पकर्णाय नमः | ॐ हेरम्बाय नमः | ॐ स्कन्दपूर्वजाय नमः ||",
      translit: {
        te: "ఓం సుముఖాయ నమః | ఓం ఏకదంతాయ నమః | ఓం కపిలాయ నమః | ఓం గజకర్ణకాయ నమః |\nఓం లంబోదరాయ నమః | ఓం వికటాయ నమః | ఓం విఘ్నరాజాయ నమః | ఓం గణాధిపాయ నమః |\nఓం ధూమ్రకేతవే నమః | ఓం గణాధ్యక్షాయ నమః | ఓం ఫాలచంద్రాయ నమః | ఓం గజాననాయ నమః |\nఓం వక్రతుండాయ నమః | ఓం శూర్పకర్ణాయ నమః | ఓం హేరంబాయ నమః | ఓం స్కందపూర్వజాయ నమః ||",
        en: "Om Sumukhāya Namaḥ | Om Ekadantāya Namaḥ | Om Kapilāya Namaḥ | Om Gajakarṇakāya Namaḥ | Om Lambodarāya Namaḥ | Om Vikaṭāya Namaḥ | Om Vighna-rājāya Namaḥ | Om Gaṇādhipāya Namaḥ | Om Dhūmra-ketave Namaḥ | Om Gaṇādhyakṣāya Namaḥ | Om Phāla-candrāya Namaḥ | Om Gajānanāya Namaḥ | Om Vakra-tuṇḍāya Namaḥ | Om Śūrpa-karṇāya Namaḥ | Om Herambāya Namaḥ | Om Skanda-pūrvajāya Namaḥ ||",
      },
    },
    {
      id: "dhupam",
      icon: "Flame",
      title: { en: "Dhūpam — Incense", te: "ధూపం", hi: "धूप", ta: "தூபம்" },
      instructions: {
        te: "అగరుబత్తి వెలిగించి ధూపాన్ని స్వామికి చూపిస్తూ మంత్రం చెప్పండి.",
        en: "Light incense, show to the deity, and recite the mantra.",
      },
      sanskrit: "दशाङ्गं गुग्गुलोपेतं सुगन्धं सुमनोहरम् |\nधूपं गृहाण देवेश सर्वदेव नमस्कृत ||",
      translit: {
        te: "దశాంగం గుగ్గులో పేతం సుగంధిం సుమనోహరమ్ |\nధూపం గృహాణ దేవేశ సర్వ దేవ నమస్కృత ||",
        en: "Daśāṅgaṁ gugguloopetaṁ sugandhaṁ sumanoharam | Dhūpaṁ gṛhāṇa Deveśa sarva-deva namas-kṛta ||",
      },
    },
    {
      id: "deepam",
      icon: "Lamp",
      title: { en: "Dīpam", te: "దీపం", hi: "दीप", ta: "தீபம்" },
      instructions: {
        te: "దీపానికి నమస్కారం చేసుకొని రెండు చేతులతో దేవుళ్ళకి చూపిస్తూ మంత్రం చెప్పండి.",
        en: "Namaskaram to the lamp, then show it to the deity with both hands while chanting.",
      },
      sanskrit: "घृताक्तवर्ति संयुक्तं वह्निना योजितं प्रियम् |\nदीपं गृहाण देवेश त्रैलोक्य तिमिरापहम् ||",
      translit: {
        te: "ఘృతాక్తవర్తి సంయుక్తం వహ్నినా యోజితం ప్రియం |\nదీపం గృహాణ దేవేశ, త్రైలోక్య తిమిరాపహం ||",
        en: "Ghṛtākta-varti saṁyuktaṁ vahninā yojitaṁ priyam | Dīpaṁ gṛhāṇa Deveśa trailokya-timirāpaham ||",
      },
    },
    {
      id: "naivedyam",
      icon: "Cookie",
      title: { en: "Naivedyam", te: "నైవేద్యం", hi: "नैवेद्य", ta: "நைவேத்யம்" },
      instructions: {
        te: "నైవేద్యాలు స్వామివారి ముందు పెట్టి పై గాయత్రి మంత్రం చెపుతూ, కలశంలోని పుష్పంతో నైవేద్యం చుట్టూ నీళ్లు జల్లండి. తరువాత 5 సార్లు క్రింది ప్రాణ మంత్రాలు చెపుతూ స్వామివారికి చూపండి. చివరగా 'మధ్యే మధ్యే పానీయం సమర్పయామి' అంటూ కలశంలోని నీళ్లు ప్లేటులో వదిలిపెట్టండి.",
        en: "Place the naivedyam before the deity. Recite the Gayatri, then with the kalasha flower sprinkle water around the offering. Show it to the deity 5 times reciting the prāṇa mantras. Conclude with 'Madhye madhye pānīyaṁ samarpayāmi' releasing water into the plate.",
      },
      sanskrit: "ॐ भूर्भुवस्सुवः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् |\nसत्यं त्वर्तेन परिषिञ्चामि | अमृतमस्तु | अमृतोपस्तरणमसि |\nॐ प्राणाय स्वाहा | ॐ अपानाय स्वाहा | ॐ व्यानाय स्वाहा | ॐ उदानाय स्वाहा | ॐ समानाय स्वाहा |\nनैवेद्यं समर्पयामि | मध्ये मध्ये पानीयं समर्पयामि | हस्तौ प्रक्षालयामि | पादौ प्रक्षालयामि | शुद्ध आचमनीयं समर्पयामि ||",
      translit: {
        te: "ఓం భూర్భువస్సువః తత్సవితుర్వరేణ్యం, భర్గో దేవస్య ధీమహి ధియో యో నః ప్రచోదయాత్ |\nసత్యం త్వర్తేన పరిషించామి, అమృతమస్తు, అమృతోపస్తరణమసి |\nఓం ప్రాణాయ స్వాహా, ఓం అపానాయ స్వాహా, ఓం వ్యానాయ స్వాహా, ఓం ఉదానాయ స్వాహా, ఓం సమానాయ స్వాహా |\nనైవేద్యం సమర్పయామి | మధ్యే మధ్యే పానీయం సమర్పయామి | హస్తౌ ప్రక్షాళయామి | పాదౌ ప్రక్షాళయామి | శుద్ధ ఆచమనీయం సమర్పయామి ||",
        en: "Om Bhūrbhuvassuvaḥ tat savitur vareṇyaṁ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt | Satyaṁ tvartena pariṣiñcāmi | Amṛtam-astu | Amṛtopa-staraṇam-asi | Om Prāṇāya Svāhā | Om Apānāya Svāhā | Om Vyānāya Svāhā | Om Udānāya Svāhā | Om Samānāya Svāhā | Naivedyaṁ samarpayāmi | Madhye madhye pānīyaṁ samarpayāmi | Hastau prakṣālayāmi | Pādau prakṣālayāmi | Śuddha-ācamanīyaṁ samarpayāmi ||",
      },
    },
    {
      id: "tambulam",
      icon: "Leaf",
      title: { en: "Tāmbūlam", te: "తాంబూలం", hi: "ताम्बूल", ta: "தாம்பூலம்" },
      instructions: {
        te: "పుష్పం, అక్షింతలు చేతిలో పట్టుకొని క్రింది మంత్రం చెప్పి, తరువాత దేవుళ్ళ వద్ద వేయండి.",
        en: "Hold flower and akshata, recite the mantra, and offer at the deity.",
      },
      sanskrit: "पूगीफलैः सकर्पूरैः नागवल्ली दलैर्युतम् |\nमुक्ताचूर्ण समायुक्तं ताम्बूलं प्रतिगृह्यताम् ||\nताम्बूलं समर्पयामि ||",
      translit: {
        te: "పూగీఫలై స్సకర్పూరై నాగవల్లీ దళైర్యుతమ్ |\nముక్తాచూర్ణ సమాయుక్తం తాంబూలం ప్రతిగృహ్యతామ్ ||\nతాంబూలం సమర్పయామి |",
        en: "Pūgī-phalaiḥ sakarpūraiḥ nāga-vallī dalair-yutam | Muktā-cūrṇa samāyuktaṁ tāmbūlaṁ pratigṛhyatām | Tāmbūlaṁ samarpayāmi ||",
      },
    },
    {
      id: "neerajanam",
      icon: "Flame",
      title: { en: "Nīrājanam — Hārati", te: "నీరాజనం (హారతి)", hi: "नीराजन (आरती)", ta: "நீராஜநம் (ஆரத்தி)" },
      instructions: {
        te: "హారతి వెలిగించి క్రింది మంత్రం చెపుతూ స్వామివారికి చూపండి. ఎడమచేతిలోకి తీసుకొని, కలశంలోని పుష్పంతో నీళ్లు చూపించి ప్లేటులో వదిలిపెట్టి, పుష్పాన్ని కలశంలో పెట్టి, కుడిచేత్తో స్వామికి హారతి చూపి, కళ్ళకు అద్దుకోండి.",
        en: "Light the ārati, chant, and wave clockwise before the deity. Take into left hand, sprinkle water from the kalasha with the flower, place the flower back, wave once more with right hand, and touch to your eyes.",
      },
      sanskrit: "नीराजनं गृहाणेदं पञ्चवर्ति समन्वितम् |\nतेजोराशिमयं दत्तं गृहाण त्वं सुरेश्वर ||",
      translit: {
        te: "నీరాజనం గృహాణేదం పంచవర్తి సమన్వితం |\nతేజోరాశి మయం దత్తం గృహాణత్వం సురేశ్వర ||",
        en: "Nīrājanaṁ gṛhāṇedaṁ pañca-varti samanvitam | Tejo-rāśi-mayaṁ dattaṁ gṛhāṇa tvaṁ Sureśvara ||",
      },
    },
    {
      id: "gayatri-mantras",
      icon: "Sun",
      title: { en: "Deity Gāyatrī Mantras", te: "దేవతా గాయత్రి మంత్రాలు", hi: "देवता गायत्री मन्त्र", ta: "தேவதா காயத்ரி மந்திரங்கள்" },
      instructions: {
        te: "లేచి నుంచుని, పుష్పం-అక్షింతలు చేతిలో పట్టుకొని ఈ మంత్రాలు చెప్పండి. తర్వాత చేతిలో ఉన్నవి దేవుళ్ళ వద్ద ఉంచి నమస్కారం చేయండి.",
        en: "Stand up, hold flower and akshata, recite these three Gayatri mantras (Ganesha, Lakshmi, Venkatesha), then offer and namaskaram.",
      },
      sanskrit: "ॐ तत्पुरुषाय विद्महे वक्रतुण्डाय धीमहि | तन्नो दन्तिः प्रचोदयात् ||\nॐ महादेव्यै च विद्महे विष्णुपत्न्यै च धीमहि | तन्नो लक्ष्मीः प्रचोदयात् ||\nॐ वेङ्कटेशाय विद्महे श्रीमन्नाथाय धीमहि | तन्नो श्रीशः प्रचोदयात् ||",
      translit: {
        te: "ఓం తత్పురుషాయ విద్మహే వక్రతుండాయ ధీమహి | తన్నో దంతిః ప్రచోదయాత్ ||\nఓం మహాదేవ్యైచ విద్మహే విష్ణుపత్న్యైచ ధీమహి | తన్నో లక్ష్మీః ప్రచోదయాత్ ||\nఓం వేంకటేశాయ విద్మహే శ్రీమన్నాథాయ ధీమహి | తన్నో శ్రీశః ప్రచోదయాత్ ||",
        en: "Om Tatpuruṣāya vidmahe Vakratuṇḍāya dhīmahi | Tanno Dantiḥ pracodayāt || Om Mahā-devyai ca vidmahe Viṣṇu-patnyai ca dhīmahi | Tanno Lakṣmīḥ pracodayāt || Om Veṅkaṭeśāya vidmahe Śrīman-nāthāya dhīmahi | Tanno Śrīśaḥ pracodayāt ||",
      },
    },
    {
      id: "pradakshina",
      icon: "RotateCw",
      title: { en: "Pradakṣiṇa (Circumambulation)", te: "ప్రదక్షిణ", hi: "प्रदक्षिणा", ta: "ப்ரதக்ஷிணம்" },
      instructions: {
        te: "అక్షింతలు తీసుకొని క్రింది మంత్రం చెపుతూ కుడి వైపుగా 3 సార్లు ప్రదక్షిణ చేయండి.",
        en: "Take akshata, recite the mantra and circumambulate 3 times clockwise.",
      },
      sanskrit: "यानि कानि च पापानि जन्मान्तर-कृतानि च |\nतानि तानि प्रणश्यन्ति प्रदक्षिण पदे पदे ||\nपापोऽहं पापकर्माहं पापात्मा पापसम्भवः |\nत्राहि मां कृपया देव शरणागत वत्सल ||\nअन्यथा शरणं नास्ति त्वमेव शरणं मम |\nतस्मात् कारुण्य भावेन रक्ष रक्ष जनार्दन ||\nआत्म-प्रदक्षिण नमस्कारान् समर्पयामि ||",
      translit: {
        te: "యానికానిచ పాపాని జన్మాంతరకృతానిచ | తానితాని ప్రణశ్యంతి ప్రదక్షిణ పదే పదే ||\nపాపోహం పాపకర్మాహం పాపాత్మా పాపసంభవః | త్రాహిమాం కృపయా దేవ శరణాగత వత్సల ||\nఅన్యథా శరణం నాస్తి త్వమేవ శరణం మమ | తస్మాత్కారుణ్య భావేన రక్షరక్ష జనార్ధన ||\nఆత్మప్రదక్షిణ నమస్కారాన్ సమర్పయామి ||",
        en: "Yāni kāni ca pāpāni janmāntara-kṛtāni ca | tāni tāni praṇaśyanti pradakṣiṇa pade pade || Pāpo'haṁ pāpa-karmāhaṁ pāpātmā pāpa-sambhavaḥ | trāhi māṁ kṛpayā deva śaraṇāgata-vatsala || Anyathā śaraṇaṁ nāsti tvam-eva śaraṇaṁ mama | tasmāt kāruṇya-bhāvena rakṣa rakṣa Janārdana || Ātma-pradakṣiṇa namaskārān samarpayāmi ||",
      },
    },
    {
      id: "punah-puja",
      icon: "Sparkles",
      title: { en: "Punaḥ Pūjā — Royal Services", te: "పునః పూజ", hi: "पुनः पूजा", ta: "புந: பூஜை" },
      instructions: {
        te: "కూచుని అక్షింతలు తీసుకొని స్వామివారి మీద వేస్తూ ఈ మంత్రాలు చెప్పండి.",
        en: "Sit, take akshata, offer at each line.",
      },
      sanskrit: "पुनः पूजां करिष्ये | छत्रम् आच्छादयामि | चामराभ्यां वीजयामि |\nनृत्यं दर्शयामि | गीतं श्रावयामि | आन्दोलिकाम् आरोहयामि |\nअश्वान् आरोहयामि | गजान् आरोहयामि |\nसमस्त राजोपचार देवोपचार भक्त्युपचार शक्त्युपचार मन्त्रोपचार तन्त्रोपचार पूजा समर्पयामि ||",
      translit: {
        te: "పునః పూజాం కరిష్యే | ఛత్రమాచ్ఛాదయామి | చామరాభ్యాం వీజయామి |\nనృత్యం దర్శయామి | గీతం శ్రావ్యయామి | ఆందోళికాన్ ఆరోహయామి |\nఅశ్వాన్ ఆరోహయామి | గజాన్ ఆరోహయామి |\nసమస్త రాజోపచార, దేవోపచార, భక్త్యుపచార, శక్త్యుపచార, మంత్రోపచార, తంత్రోపచార పూజా సమర్పయామి ||",
        en: "Punaḥ pūjāṁ kariṣye | Chatram-ācchādayāmi | Cāmarābhyāṁ vījayāmi | Nṛtyaṁ darśayāmi | Gītaṁ śrāvayāmi | Āndolikām-ārohayāmi | Aśvān-ārohayāmi | Gajān-ārohayāmi | Samasta rājopacāra devopacāra bhaktyupacāra śaktyupacāra mantropacāra tantropacāra pūjāṁ samarpayāmi ||",
      },
    },
    {
      id: "kshama",
      icon: "HandHelping",
      title: { en: "Kṣamā Prārthanā & Samarpaṇam", te: "క్షమా ప్రార్థన & సమర్పణం", hi: "क्षमा प्रार्थना एवं समर्पण", ta: "க்ஷமா ப்ரார்த்தநை & ஸமர்ப்பணம்" },
      instructions: {
        te: "అక్షింతలు చేతిలో పట్టుకొని ఈ మంత్రం చెప్పండి. తరువాత ఆచమన పాత్రలోని నీటిని కుడి చేతిలో పోసుకొని అక్షింతలను పళ్ళెంలో వదిలిపెట్టండి. — శుభం.",
        en: "Take akshata, recite the closing mantra. Then pour a little water from the achamana vessel over the akshata and release into the plate. — Shubham.",
      },
      sanskrit: "यस्य स्मृत्या च नामोक्त्या तपः पूजा क्रियादिषु |\nन्यूनं सम्पूर्णतां याति सद्यो वन्दे तम् अच्युतम् ||\nमन्त्रहीनं क्रियाहीनं भक्तिहीनं जनार्दन |\nयत् पूजितं मया देव परिपूर्णं तदस्तु ते ||\nअनया ध्यानम् आवाहनादि षोडशोपचार पूजया च भगवान् सर्वात्मकः सर्वं\nश्री महा गणाधिपति देवता सुप्रीता सुप्रसन्नो वरदो भवतु |\nएतत् फलं परमेश्वरार्पणमस्तु ||",
      translit: {
        te: "యస్యస్మృత్యాచ నామోఖ్య తపః పూజా క్రియాదిషు | న్యూనం సంపూర్ణం తాం యాతి సద్యో వందే తమచ్యుతం ||\nమంత్రహీనం క్రియాహీనం భక్తి హీనం జనార్ధన | యత్పూజితం మయాదేవ పరిపూర్ణం తదస్తుతే ||\nఅనయా ధ్యానమావాహనాది షోడశోపచార పూజయాచ, భగవాన్ సర్వాత్మకః సర్వం శ్రీ మహాగణాధిపతి దేవతా సుప్రీతా సుప్రసన్నో వరదో భవతు |\nఏతత్ఫలం పరమేశ్వరార్పణమస్తు ||",
        en: "Yasya smṛtyā ca nāmoktyā tapaḥ pūjā kriyādiṣu | nyūnaṁ sampūrṇatāṁ yāti sadyo vande tam Acyutam || Mantra-hīnaṁ kriyā-hīnaṁ bhakti-hīnaṁ Janārdana | yat-pūjitaṁ mayā Deva paripūrṇaṁ tad-astu te || Anayā dhyānam-āvāhanādi ṣoḍaśopacāra pūjayā ca Bhagavān sarvātmakaḥ sarvaṁ Śrī Mahā-Gaṇādhipati devatā suprītā suprasannā varadā bhavatu | etat phalaṁ Parameśvarārpaṇam-astu ||",
      },
    },
  ],
};

// Ishta devata favorite stotram map (kept for backward compatibility with NityaPooja page)
import { DEITIES } from "@/data/deities";
export const ISHTA_STOTRAM_MAP = {
  ganesha:    { title: { en: "Saṅkaṭanāśana Gaṇeśa Stotram", te: "సంకటనాశన గణేశ స్తోత్రం", hi: "संकटनाशन गणेश स्तोत्रम्", ta: "ஸங்கடநாசந கணேச ஸ்தோத்திரம்" }, when: { en: "During Puṣpam / Archanā step, especially on Chaturthi.", te: "పుష్పార్చన సమయంలో, చవితి రోజు ప్రత్యేకంగా.", hi: "पुष्पार्चन के समय, चतुर्थी को विशेषतः।", ta: "புஷ்ப அர்ச்சனை நேரத்தில், சதுர்த்தியில் விசேஷமாக." } },
  shiva:      { title: { en: "Śiva Tāṇḍava Stotram / Bilvāṣṭakam", te: "శివ తాండవ స్తోత్రం / బిల్వాష్టకం", hi: "शिव ताण्डव / बिल्वाष्टकम्", ta: "சிவ தாண்டவ / பில்வாஷ்டகம்" }, when: { en: "During Snāna / Puṣpam step, on Mondays & Śivarātri.", te: "స్నానం / పుష్పం సమయంలో, సోమవారం, శివరాత్రి.", hi: "स्नान / पुष्प के समय, सोमवार व शिवरात्रि।", ta: "ஸ்நாநம் / புஷ்ப நேரத்தில், திங்கள் மற்றும் சிவராத்திரி." } },
  vishnu:     { title: { en: "Viṣṇu Sahasranāma", te: "విష్ణు సహస్రనామం", hi: "विष्णु सहस्रनाम", ta: "விஷ்ணு ஸஹஸ்ரநாமம்" }, when: { en: "After Naivedyam, on Ekādaśī.", te: "నైవేద్యం తర్వాత, ఏకాదశి రోజున.", hi: "नैवेद्य के बाद, एकादशी को।", ta: "நைவேத்யத்திற்குப் பின், ஏகாதசியில்." } },
  krishna:    { title: { en: "Madhurāṣṭakam / Gopāla Sahasranāma", te: "మధురాష్టకం / గోపాల సహస్రనామం", hi: "मधुराष्टकम्", ta: "மதுராஷ்டகம்" }, when: { en: "During butter/misri Naivedyam.", te: "వెన్న / మిశ్రి నైవేద్య సమయంలో.", hi: "मक्खन / मिश्री नैवेद्य समय।", ta: "வெண்ணெய் / மிச்சரி நைவேத்யத்தில்." } },
  rama:       { title: { en: "Rāma Rakṣā Stotram", te: "రామ రక్షా స్తోత్రం", hi: "राम रक्षा स्तोत्रम्", ta: "ராம ரக்ஷா ஸ்தோத்திரம்" }, when: { en: "After Puṣpam step for protection.", te: "పుష్పార్చన తర్వాత, రక్షణ కోసం.", hi: "पुष्प के पश्चात्, रक्षा हेतु।", ta: "புஷ்பத்திற்குப் பின், பாதுகாப்பிற்காக." } },
  hanuman:    { title: { en: "Hanumān Chālīsā", te: "హనుమాన్ చాలీసా", hi: "हनुमान चालीसा", ta: "ஹனுமான் சாலீஸா" }, when: { en: "Especially on Tuesdays & Saturdays.", te: "మంగళ, శని వారాలలో.", hi: "मंगल व शनि वार।", ta: "செவ்வாய், சனிக்கிழமை." } },
  lakshmi:    { title: { en: "Śrī Sūktam / Kanakadhārā Stotram", te: "శ్రీ సూక్తం / కనకధారా స్తోత్రం", hi: "श्री सूक्तम्", ta: "ஸ்ரீ சூக்தம்" }, when: { en: "During Puṣpam, Fridays & Dīpāvalī.", te: "పుష్ప సమయంలో, శుక్రవారం, దీపావళి.", hi: "पुष्प समय, शुक्रवार व दीपावली।", ta: "புஷ்ப நேரத்தில், வெள்ளிக்கிழமை, தீபாவளி." } },
  saraswati:  { title: { en: "Sarasvatī Stotram", te: "సరస్వతీ స్తోత్రం", hi: "सरस्वती स्तोत्रम्", ta: "ஸரஸ்வதி ஸ்தோத்திரம்" }, when: { en: "Before study / Vasanta Pañcamī.", te: "చదువుకు ముందు / వసంత పంచమి.", hi: "अध्ययन से पूर्व / वसंत पंचमी।", ta: "படிக்கும் முன் / வஸந்த பஞ்சமி." } },
  durga:      { title: { en: "Devī Māhātmyam / Lalitā Sahasranāma", te: "దేవీ మాహాత్మ్యం / లలితా సహస్రనామం", hi: "देवी माहात्म्यम्", ta: "தேவீ மாஹாத்ம்யம்" }, when: { en: "During Navarātri, Fridays.", te: "నవరాత్రి, శుక్రవారాలలో.", hi: "नवरात्रि व शुक्रवार।", ta: "நவராத்திரி, வெள்ளிக்கிழமை." } },
  subrahmanya:{ title: { en: "Skanda Ṣaṣṭī Kavacham", te: "స్కంద షష్ఠి కవచం", hi: "स्कन्द षष्ठी कवचम्", ta: "ஸ்கந்த ஷஷ்டி கவசம்" }, when: { en: "Every Ṣaṣṭhī tithi, Tuesdays.", te: "షష్ఠి తిథి, మంగళవారం.", hi: "षष्ठी तिथि, मंगलवार।", ta: "ஷஷ்டி திதி, செவ்வாய்." } },
  surya:      { title: { en: "Āditya Hṛdayam", te: "ఆదిత్య హృదయం", hi: "आदित्य हृदयम्", ta: "ஆதித்ய ஹ்ருதயம்" }, when: { en: "At sunrise, Sundays & Ratha Saptamī.", te: "సూర్యోదయం, ఆదివారం, రథసప్తమి.", hi: "सूर्योदय, रविवार व रथ सप्तमी।", ta: "சூரிய உதயம், ஞாயிறு, ரத ஸப்தமி." } },
  ayyappa:    { title: { en: "Harivarāsanam", te: "హరివరాసనం", hi: "हरिवरासनम्", ta: "ஹரிவராஸநம்" }, when: { en: "At end of pooja, esp. Maṇḍala kāla.", te: "పూజ చివర, మండల కాలంలో.", hi: "पूजा अन्त में, मंडल काल।", ta: "பூஜை நிறைவில், மண்டல காலம்." } },
};
