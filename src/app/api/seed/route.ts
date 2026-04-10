import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const profiles = [
  { username: "priya.vibes", display_name: "Priya", avatar_emoji: "👩🏽", bio: "chai > coffee, fight me. also i paint at 2am and regret nothing", age: 22, city: "Mumbai", vibes: ["Art","Coffee","Music","Poetry"], is_online: true },
  { username: "arjun.codes", display_name: "Arjun", avatar_emoji: "🧑🏻", bio: "building stuff nobody asked for. full-stack dev by day, guitarist by 1am", age: 24, city: "Bangalore", vibes: ["Code","Music","StartUp","Gaming"], is_online: true },
  { username: "meera_writes", display_name: "Meera", avatar_emoji: "👧🏽", bio: "hopeless romantic who writes poetry on napkins. swipe right if you read rumi", age: 21, city: "Delhi", vibes: ["Poetry","Books","Coffee","Art"], is_online: false },
  { username: "rahul.mp4", display_name: "Rahul", avatar_emoji: "👦🏽", bio: "midnight drives with old bollywood songs. thats it. thats the personality.", age: 23, city: "Pune", vibes: ["Music","Travel","Movies","Photography"], is_online: true },
  { username: "ananya.doodles", display_name: "Ananya", avatar_emoji: "👩🏻", bio: "graphic designer who cant stop buying house plants. send memes pls", age: 20, city: "Mumbai", vibes: ["Art","Fashion","Coffee","Comedy"], is_online: true, is_premium: true },
  { username: "vikram.exe", display_name: "Vikram", avatar_emoji: "🧔🏽", bio: "IIT dropout turned indie hacker. building my third failed startup :)", age: 26, city: "Bangalore", vibes: ["Code","StartUp","Fitness","Books"], is_online: false },
  { username: "deepika.lens", display_name: "Deepika", avatar_emoji: "👩🏽‍🦱", bio: "street photographer. i will stop in the middle of the road for golden hour", age: 24, city: "Chennai", vibes: ["Photography","Travel","Art","Nature"], is_online: true },
  { username: "karthik.wav", display_name: "Karthik", avatar_emoji: "🧑🏾", bio: "lo-fi producer. if you like nujabes, we are already friends", age: 25, city: "Hyderabad", vibes: ["Music","Code","Anime","Coffee"], is_online: false },
  { username: "riya.goa", display_name: "Riya", avatar_emoji: "👧🏻", bio: "permanently planning my next goa trip. sunsets > everything", age: 22, city: "Goa", vibes: ["Travel","Music","Nature","Photography"], is_online: true },
  { username: "aditya.fit", display_name: "Aditya", avatar_emoji: "💪🏽", bio: "gym bro but also cry to arijit singh. complex personality", age: 23, city: "Delhi", vibes: ["Fitness","Music","Food","Comedy"], is_online: true, is_premium: true },
  { username: "sneha.reads", display_name: "Sneha", avatar_emoji: "👩🏻‍🦰", bio: "bookstagram addict. currently reading murakami for the 5th time", age: 21, city: "Kolkata", vibes: ["Books","Poetry","Coffee","Movies"], is_online: false },
  { username: "rohan.frames", display_name: "Rohan", avatar_emoji: "🧑🏽", bio: "cinema kid. can quote every anurag kashyap film. also make short films nobody watches", age: 27, city: "Mumbai", vibes: ["Movies","Photography","Art","Music"], is_online: true },
  { username: "kavya.aesthetic", display_name: "Kavya", avatar_emoji: "👩🏽‍🦱", bio: "architecture student surviving on maggi and caffeine. pinterest is my therapy", age: 20, city: "Jaipur", vibes: ["Art","Fashion","Coffee","Photography"], is_online: true },
  { username: "nikhil.404", display_name: "Nikhil", avatar_emoji: "🧑🏻‍💻", bio: "backend dev who accidentally became a meme page admin. life is weird", age: 25, city: "Pune", vibes: ["Code","Comedy","Gaming","Anime"], is_online: false },
  { username: "tanya.dances", display_name: "Tanya", avatar_emoji: "💃🏽", bio: "classical dancer gone contemporary. also addicted to reels. no regrets", age: 19, city: "Delhi", vibes: ["Dance","Music","Fashion","Art"], is_online: true },
  { username: "siddharth.chill", display_name: "Siddharth", avatar_emoji: "🧑🏽", bio: "marketing guy who makes spotify playlists for every mood", age: 24, city: "Ahmedabad", vibes: ["Music","Travel","Food","Movies"], is_online: false },
  { username: "ishita.clicks", display_name: "Ishita", avatar_emoji: "👩🏽", bio: "café hopper. been to every third wave coffee shop in bangalore", age: 23, city: "Bangalore", vibes: ["Coffee","Photography","Food","Travel"], is_online: true, is_premium: true },
  { username: "dev.nocap", display_name: "Dev", avatar_emoji: "🧔🏻", bio: "stand-up open mic regular. my jokes are mid but my confidence is elite", age: 26, city: "Mumbai", vibes: ["Comedy","Music","Food","Movies"], is_online: true },
  { username: "nandini.verse", display_name: "Nandini", avatar_emoji: "👧🏾", bio: "spoken word poet. i will make you feel things in 3 minutes flat", age: 22, city: "Chennai", vibes: ["Poetry","Books","Music","Dance"], is_online: false },
  { username: "aryan.grind", display_name: "Aryan", avatar_emoji: "🧑🏻", bio: "startup founder (pre-revenue lol). surviving on cold brew and copium", age: 27, city: "Bangalore", vibes: ["StartUp","Code","Coffee","Fitness"], is_online: true },
  { username: "zara.mood", display_name: "Zara", avatar_emoji: "🧕🏽", bio: "psych student who analyses everyone at parties. its a curse honestly", age: 21, city: "Hyderabad", vibes: ["Books","Movies","Poetry","Coffee"], is_online: true },
  { username: "aman.trails", display_name: "Aman", avatar_emoji: "🧑🏽‍🦱", bio: "trekked to every hill in himachal. next stop ladakh", age: 24, city: "Delhi", vibes: ["Travel","Nature","Photography","Fitness"], is_online: false },
  { username: "pooja.pixel", display_name: "Pooja", avatar_emoji: "👩🏻", bio: "UI/UX designer. i judge apps by their font choices", age: 23, city: "Pune", vibes: ["Code","Art","Fashion","Coffee"], is_online: true },
  { username: "kabir.bass", display_name: "Kabir", avatar_emoji: "🧑🏾", bio: "underground DJ. if you have never been to a warehouse party, we need to talk", age: 28, city: "Goa", vibes: ["Music","Dance","Travel","Photography"], is_online: true, is_premium: true },
  { username: "shruti.chai", display_name: "Shruti", avatar_emoji: "👩🏽", bio: "journalist by day, chai connoisseur by heart", age: 25, city: "Kolkata", vibes: ["Books","Travel","Food","Coffee"], is_online: false },
  { username: "varun.gameon", display_name: "Varun", avatar_emoji: "🎮", bio: "valorant addict in recovery. also learning japanese", age: 19, city: "Hyderabad", vibes: ["Gaming","Anime","Code","Music"], is_online: true },
  { username: "aditi.wildflower", display_name: "Aditi", avatar_emoji: "🌸", bio: "environmental science student. will talk about composting on a first date", age: 20, city: "Jaipur", vibes: ["Nature","Books","Travel","Art"], is_online: false },
  { username: "harsh.riffs", display_name: "Harsh", avatar_emoji: "🎸", bio: "metal guitarist in a city that only wants bollywood DJs. pain", age: 26, city: "Ahmedabad", vibes: ["Music","Fitness","Movies","Comedy"], is_online: true },
  { username: "lavanya.dreamz", display_name: "Lavanya", avatar_emoji: "👩🏾", bio: "animation student. my sketchbook is more organized than my life", age: 18, city: "Chennai", vibes: ["Art","Anime","Movies","Music"], is_online: true },
  { username: "om.peace", display_name: "Om", avatar_emoji: "🧘🏽", bio: "yoga instructor who also eats butter chicken at midnight. balance is key", age: 22, city: "Mumbai", vibes: ["Fitness","Food","Nature","Travel"], is_online: false },
];

const confessions = [
  { content: "i still listen to the playlist my ex made me. not because i miss them, but because the taste in music was elite ngl", hearts: 42, hugs: 18, sads: 7, wows: 3 },
  { content: "i told my parents i am studying for placements but i have been producing lo-fi beats for 3 months straight", hearts: 28, hugs: 12, sads: 2, wows: 15 },
  { content: "sometimes i go to cafes alone and pretend i am a character in a murakami novel. is that weird?", hearts: 55, hugs: 8, sads: 1, wows: 22 },
  { content: "i have a whole wedding playlist saved on spotify and i am only 19. no i will not elaborate", hearts: 67, hugs: 5, sads: 0, wows: 31 },
  { content: "dropped out of IIT and my parents still think i am in final year. this secret is eating me alive", hearts: 14, hugs: 89, sads: 45, wows: 8 },
  { content: "i psychoanalyse every person i date within 10 minutes. occupational hazard of being a psych student", hearts: 38, hugs: 4, sads: 0, wows: 27 },
  { content: "painted my feelings at 3am and it turned out to be the best piece i have ever made. sadness is productive i guess", hearts: 73, hugs: 31, sads: 12, wows: 9 },
  { content: "bombed my first open mic so hard that even the bartender looked away. but i went back next week. growth", hearts: 45, hugs: 22, sads: 3, wows: 18 },
  { content: "i write letters to people i will never send them to. got a whole box under my bed", hearts: 34, hugs: 52, sads: 28, wows: 6 },
  { content: "moved to goa telling everyone it was for work. it was actually because i could not handle delhi anymore. best decision ever", hearts: 81, hugs: 15, sads: 5, wows: 42 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (secret !== "unlon-seed-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  // Seed profiles
  for (const p of profiles) {
    const { error } = await supabase.from("profiles").upsert(
      { id: crypto.randomUUID(), ...p, is_premium: p.is_premium || false },
      { onConflict: "username" }
    );
    if (error) results.push(`Profile ${p.username}: ${error.message}`);
    else results.push(`Profile ${p.username}: OK`);
  }

  // Seed confessions
  for (const c of confessions) {
    const { error } = await supabase.from("confessions").insert({
      content: c.content,
      is_anonymous: true,
      hearts: c.hearts,
      hugs: c.hugs,
      sads: c.sads,
      wows: c.wows,
    });
    if (error) results.push(`Confession: ${error.message}`);
    else results.push(`Confession: OK`);
  }

  return NextResponse.json({ results });
}
