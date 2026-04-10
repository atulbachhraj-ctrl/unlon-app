-- ═══════════════════════════════════════════════════
-- UNLON — Seed Data
-- Run this in Supabase SQL Editor AFTER schema is created
-- Creates 30 realistic Indian profiles, 10 confessions, 5 night sessions
-- ═══════════════════════════════════════════════════

-- Step 1: Disable triggers + RLS so we can insert directly
ALTER TABLE profiles DISABLE TRIGGER ALL;
ALTER TABLE confessions DISABLE TRIGGER ALL;
ALTER TABLE night_sessions DISABLE TRIGGER ALL;

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE confessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE night_sessions DISABLE ROW LEVEL SECURITY;

-- Step 2: Insert 30 profiles with generated UUIDs
-- We store them in a temp table so we can reference them for confessions/sessions
DO $$
DECLARE
  uids uuid[] := ARRAY[
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid()
  ];
BEGIN

-- ═══════ 30 PROFILES ═══════
INSERT INTO profiles (id, username, display_name, avatar_emoji, bio, age, city, vibes, is_online, is_premium, last_seen, created_at) VALUES

-- 1
(uids[1], 'priya.vibes', 'Priya', '👩🏽', 'chai > coffee, fight me. also i paint at 2am and regret nothing', 22, 'Mumbai',
 ARRAY['Art','Coffee','Music','Poetry'], true, false,
 now() - interval '2 minutes', now() - interval '18 days'),

-- 2
(uids[2], 'arjun.codes', 'Arjun', '🧑🏻', 'building stuff nobody asked for. full-stack dev by day, guitarist by 1am', 24, 'Bangalore',
 ARRAY['Code','Music','StartUp','Gaming'], true, false,
 now() - interval '5 minutes', now() - interval '45 days'),

-- 3
(uids[3], 'meera_writes', 'Meera', '👧🏽', 'hopeless romantic who writes poetry on napkins. swipe right if you read rumi', 21, 'Delhi',
 ARRAY['Poetry','Books','Coffee','Art'], false, false,
 now() - interval '3 hours', now() - interval '30 days'),

-- 4
(uids[4], 'rahul.mp4', 'Rahul', '👦🏽', 'midnight drives with old bollywood songs. thats it. thats the personality.', 23, 'Pune',
 ARRAY['Music','Travel','Movies','Photography'], true, false,
 now() - interval '10 minutes', now() - interval '22 days'),

-- 5
(uids[5], 'ananya.doodles', 'Ananya', '👩🏻', 'graphic designer who cant stop buying house plants. send memes pls', 20, 'Mumbai',
 ARRAY['Art','Fashion','Coffee','Comedy'], true, true,
 now() - interval '1 minute', now() - interval '60 days'),

-- 6
(uids[6], 'vikram.exe', 'Vikram', '🧔🏽', 'IIT dropout turned indie hacker. building my third failed startup :)', 26, 'Bangalore',
 ARRAY['Code','StartUp','Fitness','Books'], false, false,
 now() - interval '6 hours', now() - interval '90 days'),

-- 7
(uids[7], 'deepika.lens', 'Deepika', '👩🏽‍🦱', 'street photographer. i will stop in the middle of the road for golden hour', 24, 'Chennai',
 ARRAY['Photography','Travel','Art','Nature'], true, false,
 now() - interval '15 minutes', now() - interval '35 days'),

-- 8
(uids[8], 'karthik.wav', 'Karthik', '🧑🏾', 'lo-fi producer. if you like nujabes, we are already friends', 25, 'Hyderabad',
 ARRAY['Music','Code','Anime','Coffee'], false, false,
 now() - interval '2 days', now() - interval '55 days'),

-- 9
(uids[9], 'riya.goa', 'Riya', '👧🏻', 'permanently planning my next goa trip. sunsets > everything', 22, 'Goa',
 ARRAY['Travel','Music','Nature','Photography'], true, false,
 now() - interval '20 minutes', now() - interval '14 days'),

-- 10
(uids[10], 'aditya.fit', 'Aditya', '💪🏽', 'gym bro but also cry to arijit singh. complex personality', 23, 'Delhi',
 ARRAY['Fitness','Music','Food','Comedy'], true, true,
 now() - interval '3 minutes', now() - interval '40 days'),

-- 11
(uids[11], 'sneha.reads', 'Sneha', '👩🏻‍🦰', 'bookstagram addict. currently reading murakami for the 5th time', 21, 'Kolkata',
 ARRAY['Books','Poetry','Coffee','Movies'], false, false,
 now() - interval '5 hours', now() - interval '25 days'),

-- 12
(uids[12], 'rohan.frames', 'Rohan', '🧑🏽', 'cinema kid. can quote every anurag kashyap film. also make short films nobody watches', 27, 'Mumbai',
 ARRAY['Movies','Photography','Art','Music'], true, false,
 now() - interval '30 minutes', now() - interval '70 days'),

-- 13
(uids[13], 'kavya.aesthetic', 'Kavya', '👩🏽‍🦱', 'architecture student surviving on maggi and caffeine. pinterest is my therapy', 20, 'Jaipur',
 ARRAY['Art','Fashion','Coffee','Photography'], true, false,
 now() - interval '8 minutes', now() - interval '10 days'),

-- 14
(uids[14], 'nikhil.404', 'Nikhil', '🧑🏻‍💻', 'backend dev who accidentally became a meme page admin. life is weird', 25, 'Pune',
 ARRAY['Code','Comedy','Gaming','Anime'], false, false,
 now() - interval '1 day', now() - interval '80 days'),

-- 15
(uids[15], 'tanya.dances', 'Tanya', '💃🏽', 'classical dancer gone contemporary. also addicted to reels. no regrets', 19, 'Delhi',
 ARRAY['Dance','Music','Fashion','Art'], true, false,
 now() - interval '12 minutes', now() - interval '20 days'),

-- 16
(uids[16], 'siddharth.chill', 'Siddharth', '🧑🏽', 'marketing guy who makes spotify playlists for every mood. yes even "sad in autorickshaw"', 24, 'Ahmedabad',
 ARRAY['Music','Travel','Food','Movies'], false, false,
 now() - interval '4 hours', now() - interval '50 days'),

-- 17
(uids[17], 'ishita.clicks', 'Ishita', '👩🏽', 'café hopper. i have been to every third wave coffee shop in bangalore. ask me anything', 23, 'Bangalore',
 ARRAY['Coffee','Photography','Food','Travel'], true, true,
 now() - interval '7 minutes', now() - interval '65 days'),

-- 18
(uids[18], 'dev.nocap', 'Dev', '🧔🏻', 'stand-up open mic regular. my jokes are mid but my confidence is elite', 26, 'Mumbai',
 ARRAY['Comedy','Music','Food','Movies'], true, false,
 now() - interval '25 minutes', now() - interval '33 days'),

-- 19
(uids[19], 'nandini.verse', 'Nandini', '👧🏾', 'spoken word poet. i will make you feel things in 3 minutes flat', 22, 'Chennai',
 ARRAY['Poetry','Books','Music','Dance'], false, false,
 now() - interval '7 hours', now() - interval '28 days'),

-- 20
(uids[20], 'aryan.grind', 'Aryan', '🧑🏻', 'startup founder (pre-revenue lol). surviving on cold brew and copium', 27, 'Bangalore',
 ARRAY['StartUp','Code','Coffee','Fitness'], true, false,
 now() - interval '4 minutes', now() - interval '100 days'),

-- 21
(uids[21], 'zara.mood', 'Zara', '🧕🏽', 'psych student who analyses everyone at parties. its a curse honestly', 21, 'Hyderabad',
 ARRAY['Books','Movies','Poetry','Coffee'], true, false,
 now() - interval '18 minutes', now() - interval '15 days'),

-- 22
(uids[22], 'aman.trails', 'Aman', '🧑🏽‍🦱', 'trekked to every hill in himachal. next stop ladakh. sponsor me pls', 24, 'Delhi',
 ARRAY['Travel','Nature','Photography','Fitness'], false, false,
 now() - interval '2 hours', now() - interval '42 days'),

-- 23
(uids[23], 'pooja.pixel', 'Pooja', '👩🏻', 'UI/UX designer. i judge apps by their font choices. comic sans is violence', 23, 'Pune',
 ARRAY['Code','Art','Fashion','Coffee'], true, false,
 now() - interval '9 minutes', now() - interval '38 days'),

-- 24
(uids[24], 'kabir.bass', 'Kabir', '🧑🏾', 'underground DJ. if you have never been to a warehouse party, we need to talk', 28, 'Goa',
 ARRAY['Music','Dance','Travel','Photography'], true, true,
 now() - interval '35 minutes', now() - interval '120 days'),

-- 25
(uids[25], 'shruti.chai', 'Shruti', '👩🏽', 'journalist by day, chai connoisseur by heart. i know the best tapri in every city', 25, 'Kolkata',
 ARRAY['Books','Travel','Food','Coffee'], false, false,
 now() - interval '12 hours', now() - interval '48 days'),

-- 26
(uids[26], 'varun.gameon', 'Varun', '🎮', 'valorant addict in recovery (jk still playing). also learning japanese', 19, 'Hyderabad',
 ARRAY['Gaming','Anime','Code','Music'], true, false,
 now() - interval '6 minutes', now() - interval '8 days'),

-- 27
(uids[27], 'aditi.wildflower', 'Aditi', '🌸', 'environmental science student. will talk about composting on a first date', 20, 'Jaipur',
 ARRAY['Nature','Books','Travel','Art'], false, false,
 now() - interval '3 days', now() - interval '52 days'),

-- 28
(uids[28], 'harsh.riffs', 'Harsh', '🎸', 'metal guitarist in a city that only wants bollywood DJs. pain', 26, 'Ahmedabad',
 ARRAY['Music','Fitness','Movies','Comedy'], true, false,
 now() - interval '40 minutes', now() - interval '75 days'),

-- 29
(uids[29], 'lavanya.dreamz', 'Lavanya', '👩🏾', 'animation student. my sketchbook is more organized than my life', 18, 'Chennai',
 ARRAY['Art','Anime','Movies','Music'], true, false,
 now() - interval '14 minutes', now() - interval '5 days'),

-- 30
(uids[30], 'om.peace', 'Om', '🧘🏽', 'yoga instructor who also eats butter chicken at midnight. balance is key', 22, 'Mumbai',
 ARRAY['Fitness','Food','Nature','Travel'], false, false,
 now() - interval '8 hours', now() - interval '62 days');


-- ═══════ 10 CONFESSIONS ═══════
INSERT INTO confessions (id, user_id, content, is_anonymous, hearts, hugs, sads, wows, created_at) VALUES

(uuid_generate_v4(), uids[3],
 'i still listen to the playlist my ex made me. not because i miss them, but because the taste in music was elite ngl',
 true, 42, 18, 7, 3, now() - interval '2 hours'),

(uuid_generate_v4(), uids[8],
 'i told my parents i am studying for placements but i have been producing lo-fi beats for 3 months straight',
 true, 28, 12, 2, 15, now() - interval '5 hours'),

(uuid_generate_v4(), uids[11],
 'sometimes i go to cafes alone and pretend i am a character in a murakami novel. is that weird?',
 true, 55, 8, 1, 22, now() - interval '1 day'),

(uuid_generate_v4(), uids[15],
 'i have a whole wedding playlist saved on spotify and i am only 19. no i will not elaborate',
 true, 67, 5, 0, 31, now() - interval '3 hours'),

(uuid_generate_v4(), uids[6],
 'dropped out of IIT and my parents still think i am in final year. this secret is eating me alive',
 true, 14, 89, 45, 8, now() - interval '8 hours'),

(uuid_generate_v4(), uids[21],
 'i psychoanalyse every person i date within 10 minutes. occupational hazard of being a psych student',
 true, 38, 4, 0, 27, now() - interval '12 hours'),

(uuid_generate_v4(), uids[1],
 'painted my feelings at 3am and it turned out to be the best piece i have ever made. sadness is productive i guess',
 true, 73, 31, 12, 9, now() - interval '4 hours'),

(uuid_generate_v4(), uids[18],
 'bombed my first open mic so hard that even the bartender looked away. but i went back next week. growth',
 true, 45, 22, 3, 18, now() - interval '1 day'),

(uuid_generate_v4(), uids[25],
 'i write letters to people i will never send them to. got a whole box under my bed',
 true, 34, 52, 28, 6, now() - interval '6 hours'),

(uuid_generate_v4(), uids[9],
 'moved to goa telling everyone it was for work. it was actually because i could not handle delhi anymore. best decision ever',
 true, 81, 15, 5, 42, now() - interval '2 days');


-- ═══════ 5 NIGHT SESSIONS ═══════
INSERT INTO night_sessions (id, user_id, mood_emoji, status_text, is_active, created_at) VALUES

(uuid_generate_v4(), uids[1],
 '🎨', 'painting and overthinking at 2am. come keep me company', true, now() - interval '30 minutes'),

(uuid_generate_v4(), uids[4],
 '🌙', 'midnight drive playlist on. just vibing', true, now() - interval '45 minutes'),

(uuid_generate_v4(), uids[8],
 '🎵', 'making beats. send me your 3am thoughts', true, now() - interval '1 hour'),

(uuid_generate_v4(), uids[13],
 '☕', 'deadline tomorrow. maggi ready. lets suffer together', true, now() - interval '20 minutes'),

(uuid_generate_v4(), uids[21],
 '🌃', 'cant sleep. analysing my own dreams now. help', true, now() - interval '15 minutes');

END $$;

-- Step 3: Re-enable triggers + RLS
ALTER TABLE profiles ENABLE TRIGGER ALL;
ALTER TABLE confessions ENABLE TRIGGER ALL;
ALTER TABLE night_sessions ENABLE TRIGGER ALL;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE night_sessions ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════
-- Done! You should now have:
-- - 30 profiles (diverse Indian Gen Z users)
-- - 10 anonymous confessions with reactions
-- - 5 active night owl sessions
-- ═══════════════════════════════════════════════════
