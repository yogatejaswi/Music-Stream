// Script to add sample lyrics to Telugu songs
const mongoose = require('mongoose');
require('dotenv').config();

async function addSampleLyrics() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const songsCollection = db.collection('songs');
        const lyricsCollection = db.collection('lyrics');

        // Get all Telugu songs
        const songs = await songsCollection.find({}).toArray();

        if (songs.length === 0) {
            console.log('❌ No songs found. Please add songs first.');
            await mongoose.disconnect();
            return;
        }

        // Sample lyrics for each song (shortened versions for demo)
        const lyricsData = {
            'Butta Bomma': ` Inthakanna Manchi Polikedhi
      Naaku Thattaledhu Gaani Ammuu
      Ee Love Anedhi Bubble-u Gum-muu
      Antukunnadhante Podhu Nammu
      Mundhu Nunchi Andharanna Maate Gaani
      Malli Antannaane Ammu
      Idhi Cheppakunda Vacche Thummu
      Premanaapalevu Nannu Nammu
      Ettagaa Anaee Yedhuru Choopuki
      Thaginattugaa Nuvvu Buthulu Chebithivaee
      Ori Devudaaa Idhendhanaentha Lopatae
      Pilladaanta Deggarai Nunnu Cheradheesthivae
      Buttabomma ButtabommaNannu Suttukuntive
      Zindhagikey AttabommaiJanta Kattukuntivey
      Buttabomma ButtabommaNannu Suttukuntive
      Zindhagikey AttabommaiJanta Kattukuntivey
      Multiplex Loni Audience Laaga
      Mounangunna Gaani Ammuu
      Lona Dandanaka Jarigindhe Nammu
      Dhimma Dhiriginaadhe Mind Sim-mu
      Raajula Kaalam Kaadhu
      Rathamu Gurram Levuu
      Addham Mundhara Naatho Nene
      Yuddham Chesthante
      Gaajula Chethulu Jaapi
      Deggarakochchina Nuvvu
      Chempallo Chitikesi
      Chekkaravaddini Chesavey
      Chinnagaa Chinuku Thumparadigithey
      Kundapothagaa Thufaanu Thesthivey
      Maatagaa O Mallepuvvunadigithey
      Mootagaa Poola Thotagaa Pynocchi Padithivey
      Buttabomma ButtabommaNannu Suttukuntive
      Zindhagikey Attabommai
      Janta Kattukuntivey
      Veli Nindaa Nannu Theesi
      Bottu Pettukuntivey
      Kaali Kindhii Puvvu Nenu
      Netthinettukuntivey
      Inthakanna Manchi Polikedhi
      Naaku Thattaledhu Gaani Ammuu
      Ee Love Anedhi Bubble-u Gum-muu
      Antukunnadhante Podhu Nammu
      Mundhu Nunchi Andharanna Maate Gaani
      Malli Antannaane Ammu
      Idhi Cheppakunda Vacche Thummu
      Premanaapalevu Nannu Nammu`,


            'Samajavaragamana': `Samajavaragamana, ninu choosi aaga galana?
Manasu meeda vayasukonna adupu cheppa taguna?

Nee kaallani pattukoni vadalanannavi, choode naa kallu,
Aa choopulanalla thokkukku vellaku, dayaleda asalu?

Nee kallaki kaavaali kasthaye, kaatukala naa kalalu;
Nuvvu nulumuthunte yerraga kandhi chindene segalu!

Naa oopiri gaaliki uyyalalu ooguthu unte mungurulu,
Nuvvu nettesthe yela nitturchavatte nishturapu vilavilalu.

Samajavaragamana, ninu choosi aaga galana?
Manasu meeda vayasukonna adupu cheppa taguna?

Mallela masama? Manjula hasama?
Prathi malupulona eduru padina vennela vanama?

Virisina pinchama? Virula prapanchama?
Ennenni vanne chinnelante ennaga vasama?

Are, naa gaale thagilina, naa neede tharimina,
Ulakava palakava bhaama?
Entho brathimaalina, inthena angana?
Madhini meetu madhuramaina manavini vinuma!

Samajavaragamana, ninu choosi aaga galana,
Manasu meeda vayasukonna adupu cheppa taguna?`,

            'Ramuloo Ramulaa': `Bantu ganiki twenty two
Basthila masthu cut out – u
Bacchagandla batch undedhi
Vachinamante suttu

Kicke saalaka o night-u
Yekki dokku bullet-u
Sandhu sandhula mandhu kosam
Ethukuthantey routu

Silku cheera kattukoni
Childu beeru merisinattu
Potlamkatttina biryaniki
Bottu billa pettinattu

Bangla mida ninchonundhiro
Ho sandhamama
Sukka tagaka chekkarocharo

Yem andham mama
Jinka leka dhunkuthuntero
Aa sandhamava
Junki jaari chikkukundhiro na
Dhilukku maava

Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro
Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro
Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro
Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro

Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro
Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro
Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro

Hey thammalapake esthunte
Kammaga vasana vosthaave
Yerraga pandina buggalu rendu
Yadhiki vasthaye

Are puvvula angee esthunte
Gundi nuvvayi poosthave
Pandukunna gundelo dhoori
Lolle chesthave
Are inti mundhu light-u
Minuku minukumantaante
Nuvvu kannu kottinattu sigguputtindhe
Seera kongu thalupu saatu sikkukuntaante
Nuvvu laaginattu vollu jallumantandhe

Nagasvaram udhuthunte nagu pamu uginattu
Yentapadi vasthunna ne
Pattagolusu sappudintu
Pattanattey thiruguthunnave
Oh sandhamava pakkaku poyee thongi susthave
Em tekkura mawa

Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro
Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro
Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro
Ramulo ramula nannagam jesindhiro
Ramulo ramula na panam tisindhiro

`,

            'Inkem Inkem Inkem Kavale': `Thadigina thakhajanu
Thadigina thakhajanu
Tharikita thadharina
Thadhemdhemtha aanandham
Thalavani thalapuga
Yedhalanu kalupaga
Modhalika modhalika
Mallee Geetha Govindam

Inkem inkem inkem kaavale
Chaalle idhi chaale
Neekai nuvve vacchi vaalave
Ikapai thiranalley
Gundellona vegam penchave
Gummamloki holy thecchave
Nuvvu pakkanunte inthenemone
Naakokko ganta okko janme
Malli putti chasthunnane

Inkem inkem inkem kaavaale
Chaalle idhi chaale
Neekai nuvve vacchi vaalave
Ikapai thiranalley

Thadigina thakhajanu
Thadigina thakhajanu
Tharikita thadharina
Thadhemdhemtha aanandham
Thalavani thalapuga
Yedhalanu kalupaga
Modhalika modhalika
Mallee Geetha Govindam
Oohalaku dhorakani sogasaa
Ooprini vadhalani golusaaa
Neeku mudi padinadhi thelusaa
Manasuna prathi kosaa
Nee kanula merupula varasaa
Repinadhi vayasuna rabhasaa
Naa chilipi kalalaku bhahusaa
idhi velugula dhasaa

Nee yedhuta nilabadu chanuvey veesaa
Andhukuni gaganapu konaley choosa

Inkem inkem inkem kaavaale
Chaalle idhi chaale
Neekai nuvve vacchi vaalaave
Ikapai thiranalley

Maayalaku kadhalani maguvaa
Maatalaku karagani madhuuvaa
Panthamulu viduvani biguvaa
Jariginadhadagavaa

Naa kadhani theluputa suluvaa
Jaalipadi numishamu vinavaa
Yendukani gadikoka godavaa
Chelimiga melagavaa
Naa peru thalachithe ubike laavaa
Challabadi nanu nuvu karuninchevaa

Inkem inkem inkem kaavale
Chaalle idhi chaale
Neekai nuvve vacchi vaalave
Ikapai thiranalley
Gundellona vegam penchaavey
Gummamloki holy thecchaave
Nuvvu pakkanunte inthenemone
Naakokko ganta okko janme
Malli putti chasthunnaaney

Inkem inkem inkem kavale
Chaalle idhi chaale
Neekai nuvve vacchi vaalave
Ikapai thiranalley

Thadigina thakhajanu
Thadigina thakhajanu
Tharikita thadharina
Thadhemdhemtha aanandham
Thalavani thalapuga
Yedhalanu kalupaga
Modhalika modhalika
Mallee Geetha Govindam`,

            'Vachinde': `Vachinde Mella Mellaga Vachinde
                Cream-u Biscuit Esinde 
                Gammuna Koosoniyyade 
                Kudhuruga Nilsoniyyade
                
                Sanna Sannga Navvinde 
                Kunuke Gaayab Jesinde 
                Muddha Notiki Pokundaa 
                Maasthu Disturb Chesinde
                
                Pilla Renukka Pilagaadochhinde
                Dinner Annaade Date Annaade
                 Elu Patti Polu Thirigi
                 Ninnu Ultaa Seedha Jesinde 
                 
                Vachinde Mella Mellaga Vachinde 
                Cream-u Biscuit Esinde 
                Gammuna Koosoniyyade 
                Kudhuruga Nilsoniyyade 
                
                Sanna Sannga Navvinde 
                Kunuke Gaayab Jesinde 
                Muddha Notiki Pokundaa 
                Maasthu Disturb Chesinde 
                Pilla Renukka Pilagaadochhinde, Vachhinde 
                
                Magavaallu Maasth Chaalu… Magavallu Maasth Chaalu 
                Magavallu Maasth Chaalu… Maskalu Godathaa Untaare 
                Nuvu Enna Poosa Lekka Karigithe Anthe Sangathi 
                O saari Sare Antoo… O saari Sorry Antoo 
                Maintain Nuv Jesthe… Life Antha Paduntaade, Ye Ye 
                
                Vachinde Mella Mellaga Vachinde 
                Cream-u Biscuit Esinde 
                Gammuna Koosoniyyade 
                Kudhuruga Nilsoniyyade 
                Sanna Sannga Navvinde 
                Kunuke Gaayab Jesinde 
                Muddha Notiki Pokundaa 
                Maasthu Disturb Chesinde 
                Ai Baaboi Entha Podugo… Ai Baaboi Entha Podugo 
                Ai Baaboi Entha Podugo… Muddhu Letta Ichhude 
                Ai Baaboi Entha Podugo… Muddhu Letta Ichhude 
                Thana Mundhu Nichhanesi… Ekkithe Kaani Andhade 
                
                Paruvaale Nadum Patti… Paiketthi Muddhe Pette 
                Technique-Se Naakunnai Le… Pareshaane Neekakkarle, Ye Ye 
                
                Vachinde Mella Mellaga Vachinde… Cream-u Biscuit Esinde 
                Gammuna Koosoniyyade… Kudhuruga Nilsoniyyade 
                Sanna Sannga Navvinde… Kunuke Gaayab Jesinde 
                Muddha Notiki Pokundaa… Maasthu Disturb Chesinde 
                
                Pilla Renukka Pilagaadochhinde 
                Dinner Annaade Date Annaade 
                Elu Patti Polu Thirigi… Ninnu Ultaa... Seedha Jesinde
Arre..! O Pilla Inka Nuvvu
Nelanidichi Gaali Motor Lo

Vachinde Mella Mellaga Vachinde
Cream-u Biscuit Esinde
Gammuna Koosoniyyade
Kudhuruga Nilsoniyyade
Sanna Sannga Navvinde
Kunuke Gaayab Jesinde
Muddha Notiki Pokundaa
Maasthu Disturb Chesinde

O, Relaare Re Laare
Relaare Relaare Re Laare……`



        };

        let addedCount = 0;

        for (const song of songs) {
            // Check if lyrics already exist for this song
            const existingLyrics = await lyricsCollection.findOne({ songId: song._id });

            if (existingLyrics) {
                console.log(`⏭️  Lyrics already exist for: ${song.title}`);
                continue;
            }

            // Find matching lyrics
            const lyricsText = lyricsData[song.title];

            if (lyricsText) {
                await lyricsCollection.insertOne({
                    songId: song._id,
                    lyrics: lyricsText,
                    language: 'te', // Telugu
                    source: 'manual',
                    verified: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`✅ Added lyrics for: ${song.title}`);
                addedCount++;
            } else {
                console.log(`⚠️  No lyrics template for: ${song.title}`);
            }
        }

        console.log(`\n🎵 Successfully added lyrics to ${addedCount} songs!`);
        console.log('✅ Done! You can now view lyrics in the player.');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addSampleLyrics();
