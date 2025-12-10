import ForumPost from "@/app/components/ForumPost";

export default function Page({ params }) {
  const { id } = params;

  // Fake placeholder — you’ll replace with Firestore or local data
  const stories = [
    {
  id: "1",
  title: "The Perfect Bozeman Weekend",
  content: `It started on the Ridge at Bridger, the kind of morning where the sky feels too close and the wind hits you like it wants a fight. We traversed into the teeth of a full-blown blizzard—snow nuking sideways, visibility maybe the length of a ski pole, the wind shrieking so loud it felt like it was shaking the fillings in my teeth. Cornus was leading the charge, yelling something about “style points” while Pomoca, his so-called best friend, kept slipping off his skins in protest. There were no friends on a powder day—just silhouettes of helmets disappearing over rollovers and the occasional “YEEEW!” swallowed by the wind.

We skied blind, bombing down chalky steeps and wind-loaded pockets we pretended were intentional lines. The snow hammered our jackets so hard it stung. Every turn felt like a dare.

By the time we skied down to the lot, we looked like ghosts—frozen eyebrows, ice caked into our beanies, grins frozen onto our faces. We piled into the Subaru, blasted the heat on high, and went straight to MAP for the only thing that made sense: pints of Midas Crush and a plate of poutine so heavy it probably violated at least three health guidelines. We sat there steam-melting, boots half-unbuckled, beanies sitting just a little too high on our skulls because we lost the energy to adjust them.

Bucklet Night hit like a meteor. One beer became three, three became six, and before long, the whole bar felt like a slow-motion stampede of Carhartt double-knees and flannels. At some point I realized I’d forgotten my Blundstones at home and was wearing old trail runners that looked like they’d been mailed in from 2017. Didn’t matter. We danced, yelled, shoulder-checked each other like we were celebrating a Super Bowl win.

The next morning was a crime scene. I woke up with a headache so sharp it felt like someone had inserted a tuning fork into my skull. But plans were plans, and Beehive Basin doesn’t ski itself. We skinned through still air and soft morning light, moving slow but steady, letting the previous night sweat out of our pores. Cornus and Pomoca bickered over who forgot the gummy bears. At the top, the basin was silent, untouched—smooth, glowing, peaceful. We skied powder so cold it felt like skiing through dusted velvet.

That night we did it again, but Bozeman-style: Mountain Walking, then the Legion for bottomless popcorn, then stumbling over to 317 to split “the G” like absolute degenerates. We talked about snowpack stability, Colter Wall lyrics, questionable life decisions, and the Beehive sunrise like it was a religious experience.

It was the perfect weekend—not because anything went right, but because everything fit together exactly how a Bozeman winter should. Snow, friends, chaos, cheap beer, big mountains, and the kind of hangovers that prove you’re living the good life.`
}
,
    {
  id: "2",
  title: "The Night the Bridger Chairs Froze",
  content: `It was one of those January nights where the cold feels personal. The kind where every sound is hollow and clean, and the sky looks like it's been sandblasted with stars. We decided to night ride the parking lot, which in Bozeman terms means shoveling a sketchy jump under the glow of two car headlamps and hoping we don’t break anything important.

Halfway through building the kicker, we realized the Bridger chairs weren’t moving. Completely frozen. Not swaying, not creaking, not even twitching. Just hanging there like fossils above us. We kept looking up at them like they were watching the whole scene.

Cornus claimed the frozen chairs were a good omen. “Cold metal means cold smoke,” he said, which made zero sense but we nodded because it sounded wise in the moment. Pomoca, faithful as ever, kept slipping off his skins even though he was nowhere near snow.

We sessioned that janky jump for hours. The takeoff was lopsided, the landing nonexistent, but every crash felt like slapstick comedy that only got funnier as our toes went numb. Someone blasted Colter Wall through a Bluetooth speaker that was obviously not meant for subzero temperatures. It cut out every time the bass hit, so the whole night became this fragmented soundtrack of cowboy ballads and static.

Later we crammed into the Subaru, cranked the heat to max, and drove to the M Store for hot chocolate like a pack of frostbitten children. No plan, no agenda, just the kind of night that feels like it only exists in small mountain towns where the sky is huge and no one checks their phone.

By the time we got home, the chairs at Bridger were still frozen. The cold had won. But somehow that made the night feel legendary, like we had front-row seats to Montana showing off.`
}
,
    {
  id: "3",
  title: "Storm Day on the M",
  content: `The storm rolled in like a freight train. One minute the sky was clear, the next it was dumping so hard we couldn’t see Bozeman below us. We hiked the M anyway, because logic doesn’t stand a chance against boredom and a fresh storm cycle.

Cornus claimed the storm was “character building.” Pomoca, of course, disagreed by detaching himself from Cornus’ skis for the third time. The wind was blowing uphill so hard it felt like someone was pulling on our jackets. Snow plastered our faces like cold concrete.

We reached the big white M completely blinded, stood there breathing hard, thinking we might blow off the ridge like poorly placed Christmas decorations. Then we ran down the switchbacks like idiots, slipping on icy steps, laughing every time someone fell, which was often.

Back in town, we thawed out at Bagelworks with steaming egg-and-cheese bagels and coffee hot enough to burn away our poor decisions. Blizzard days in Bozeman never feel real—they’re too cinematic, too wild, too something else. This one felt like we’d been dropped inside a snow globe someone was shaking aggressively.

It didn’t make sense. That’s how we knew it was a good day.`
},
{
  id: "4",
  title: "The Day We Tried to Out-Ski a Cold Front",
  content: `We checked the forecast and saw the words “Arctic air mass” which in Montana translates to “Your car might not start and your eyelashes will freeze together.” So naturally, we decided it was the perfect morning to ski Bridger.

The cold front chased us up the mountain all day. Every time we dropped into a line, it felt like we were barely outrunning the temperature. You could literally feel the air change—like skiing from breathable oxygen into a meat locker.

Cornus kept yelling, “SEND IT BEFORE THE COLD FINDS US,” which didn't help but definitely raised morale. Pomoca kept failing to stay attached because glue doesn’t work when it becomes brittle as glass.

We skied until our phones died, our water bottles froze, and the only warm thing left in our possession was the leftover hand warmer someone found in their glove from last season.

Driving back into town, the cold front finally caught us. Negative double digits. Steering wheel stiff. Heated seats useless.

So we did the only reasonable thing: went to Jam! and ordered enough food to feed a medium-sized family.

Montana wins every battle except breakfast.`
},
{
  id: "5",
  title: "Beers, Blizzards, and the Long Walk Home from Downtown",
  content: `It was supposed to be a quick drink at the Legion. Just one. But the popcorn was flowing, the beer was cheap, the jukebox kept spitting out Colter Wall, and suddenly we were three pitchers deep and arguing about snow science like we were PhD candidates.

Eventually we wandered toward 317 where someone suggested splitting “the G.” We did. Bad idea. Great idea. Who knows.

The walk home was chaos. Snow blowing sideways, streets empty, downtown glowing like a warm cave behind us. We trudged through knee-deep drifts, laughing at nothing, slipping on ice patches, singing badly, and trying to remember who had the car keys. The answer was nobody.

When we finally made it back, boots soaked, faces frozen, someone said, “We’re doing this again tomorrow.”

In Bozeman, that’s not a threat. It’s a promise.`
},
{
  id: "6",
  title: "Khanom Thai and the Death of the Overpriced Steakhouse",
  content: `It all started the night we decided to give Hop Lounge one more chance. We walked in already skeptical—the place smelled like a fryer and ambition, and the line was out the door like always. Cornus swore their chicken was “life-changing,” but Cornus also once said Pomoca had a personality, so we should’ve known better.

We waited forty minutes for food that tasted like someone described seasoning to a chef over the phone. Don’t get me wrong—it wasn’t bad. It was just aggressively fine. Like, “This exists” fine. The beer list slapped, sure, but it couldn’t save the fact that we paid Bridger lift-ticket prices for glorified cafeteria tenders.

Walking out into the cold, someone said, “Let’s hit a steakhouse.”  
Terrible idea.

We ended up downtown at one of those New-Bozeman steakhouses with Edison bulbs, reclaimed-wood tables, and bartenders who wear suspenders like they’re trying to win Most Authentic Hipster 2025. The cheapest steak tasted like it was aged behind the dumpster for exactly 36 hours, and the price alone could’ve covered a month of rent in Bozeman back before the millionaires arrived.

Our waiter described mashed potatoes like he was reading poetry. The steak itself? Mid. Not terrible—just “why did I spend $46 on this?” mid.  
Pomoca fell asleep at the table, effectively giving the food its harshest and most accurate review.

Then someone said the magic words: “What about Khanom Thai?”

Everything changed.

We trudged through the slush until we stepped into that warm, garlic-and-chili scented sanctuary. They waved at us like we were regulars—which, honestly, we basically were. The second we sat down, I didn’t even look at the menu. I already knew what I was getting: the C11. Gang Rawang Beef.

Spice level five.  
But the thing is—I’ve been in there so many times that the kitchen doesn’t even give me level five anymore. They quietly hit me with an eight. Every time. No warning. No mercy. Just respect.

And I could feel it immediately—my soul left my body, bowed politely to the chef, and came back with slightly singed eyebrows.

The rest of the table went off: yellow curry, pad see ew, drunken noodles, green curry extra spicy even though none of us are built like that. Every dish hit like it had something to prove. Real heat, real flavor, real depth. Hop Lounge could never. The steakhouse wouldn’t even understand.

Cornus took one bite and said, “This destroys Hop.”  
Pomoca wiped tears from his eyes—whether from the chili or the existential realization that we wasted an hour at the steakhouse, hard to say.

By the time we finished, we were leaning back like we had just skied the Ridge top-to-bottom without stopping. Satisfied. Humbled. Completely reset as people. We tipped heavy because Khanom Thai actually deserves it—and also because the entire bill for all of us combined cost less than a couple of cocktails at the suspenders-and-Edison-bulbs steakhouse.

Stepping back into the Bozeman cold with leftovers tucked under our arms, we realized something important:

Khanom Thai isn’t just the best food in town.  
It’s the lighthouse. The truth. The way.

Hop Lounge can keep its wait times.  
The steakhouses can keep their curated playlists and $70 ribeyes.  
We’ll be at Khanom Thai, ordering C11 at spice level eight, sweating like sinners in church, and walking out full, warm, and happy.

Sometimes the perfect night doesn't need steak or style or spectacle.  
Sometimes it just needs spice, real flavor, good people, and a meal that reminds you Bozeman still has heart.`
}

  ];

  const index = stories.findIndex((s) => s.id === id);

  if (index === -1) {
    return <div className="pt-40 text-center text-white">Story not found.</div>;
  }

  const story = stories[index];
  const prev = stories[index - 1] || null;
  const next = stories[index + 1] || null;

  return (
    <ForumPost
      title={story.title}
      content={story.content}
      prev={prev}
      next={next}
      />
  );
}
