const mockGames = [
    {
        "GameID": 1,
        "Title": "Stardew Valley",
        "Developer": "ConcernedApe",
        "Price": 15.99,
        "ReleaseDate": "2016-02-26",
        "Tags": "Farming, Simulation, Indie, Relaxing",
        "Description": "Stardew Valley by ConcernedApe. Tags: Farming, Simulation, Indie, Relaxing Released: 2016-02-26. Price: $15.99"
    },
    {
        "GameID": 2,
        "Title": "Minecraft",
        "Developer": "Mojang Studios",
        "Price": 26.95,
        "ReleaseDate": "2011-11-18",
        "Tags": "Sandbox, Building, Creative, Multiplayer",
        "Description": "Minecraft by Mojang Studios. Tags: Sandbox, Building, Creative, Multiplayer Released: 2011-11-18. Price: $26.95"
    },
    {
        "GameID": 3,
        "Title": "The Witcher 3: Wild Hunt",
        "Developer": "CD Projekt Red",
        "Price": 39.99,
        "ReleaseDate": "2015-05-19",
        "Tags": "RPG, Open World, Fantasy, Story Rich",
        "Description": "The Witcher 3: Wild Hunt by CD Projekt Red. Tags: RPG, Open World, Fantasy, Story Rich Released: 2015-05-19. Price: $39.99"
    },
    {
        "GameID": 4,
        "Title": "Portal 2",
        "Developer": "Valve",
        "Price": 9.99,
        "ReleaseDate": "2011-04-19",
        "Tags": "Puzzle, First Person, Co-op, Sci-Fi",
        "Description": "Portal 2 by Valve. Tags: Puzzle, First Person, Co-op, Sci-Fi Released: 2011-04-19. Price: $9.99"
    },
    {
        "GameID": 5,
        "Title": "Among Us",
        "Developer": "InnerSloth",
        "Price": 4.99,
        "ReleaseDate": "2018-06-15",
        "Tags": "Multiplayer, Social Deduction, Casual, Party Game",
        "Description": "Among Us by InnerSloth. Tags: Multiplayer, Social Deduction, Casual, Party Game Released: 2018-06-15. Price: $4.99"
    },
    {
        "GameID": 6,
        "Title": "Celeste",
        "Developer": "Maddy Makes Games",
        "Price": 19.99,
        "ReleaseDate": "2018-01-25",
        "Tags": "Platformer, Indie, Difficult, Story Rich",
        "Description": "Celeste by Maddy Makes Games. Tags: Platformer, Indie, Difficult, Story Rich Released: 2018-01-25. Price: $19.99"
    },
    {
        "GameID": 7,
        "Title": "Hades",
        "Developer": "Supergiant Games",
        "Price": 24.99,
        "ReleaseDate": "2020-09-17",
        "Tags": "Roguelike, Action, Indie, Greek Mythology",
        "Description": "Hades by Supergiant Games. Tags: Roguelike, Action, Indie, Greek Mythology Released: 2020-09-17. Price: $24.99"
    },
    {
        "GameID": 8,
        "Title": "Animal Crossing: New Horizons",
        "Developer": "Nintendo",
        "Price": 59.99,
        "ReleaseDate": "2020-03-20",
        "Tags": "Life Simulation, Relaxing, Multiplayer, Cute",
        "Description": "Animal Crossing: New Horizons by Nintendo. Tags: Life Simulation, Relaxing, Multiplayer, Cute Released: 2020-03-20. Price: $59.99"
    },
    {
        "GameID": 9,
        "Title": "Counter-Strike 2",
        "Developer": "Valve",
        "Price": 0,
        "ReleaseDate": "2023-09-27",
        "Tags": "FPS, Competitive, Multiplayer, Tactical",
        "Description": "Counter-Strike 2 by Valve. Tags: FPS, Competitive, Multiplayer, Tactical Released: 2023-09-27. Price: $0.00"
    },
    {
        "GameID": 10,
        "Title": "Baldur's Gate 3",
        "Developer": "Larian Studios",
        "Price": 59.99,
        "ReleaseDate": "2023-08-03",
        "Tags": "RPG, Turn-Based, Fantasy, Story Rich",
        "Description": "Baldur's Gate 3 by Larian Studios. Tags: RPG, Turn-Based, Fantasy, Story Rich Released: 2023-08-03. Price: $59.99"
    },
    {
        "GameID": 11,
        "Title": "Terraria",
        "Developer": "Re-Logic",
        "Price": 9.99,
        "ReleaseDate": "2011-05-16",
        "Tags": "Sandbox, 2D, Adventure, Multiplayer",
        "Description": "Terraria by Re-Logic. Tags: Sandbox, 2D, Adventure, Multiplayer Released: 2011-05-16. Price: $9.99"
    },
    {
        "GameID": 12,
        "Title": "Cyberpunk 2077",
        "Developer": "CD Projekt Red",
        "Price": 59.99,
        "ReleaseDate": "2020-12-10",
        "Tags": "RPG, Open World, Cyberpunk, Story Rich",
        "Description": "Cyberpunk 2077 by CD Projekt Red. Tags: RPG, Open World, Cyberpunk, Story Rich Released: 2020-12-10. Price: $59.99"
    },
    {
        "GameID": 13,
        "Title": "Fall Guys",
        "Developer": "Mediatonic",
        "Price": 0,
        "ReleaseDate": "2020-08-04",
        "Tags": "Battle Royale, Party Game, Multiplayer, Casual",
        "Description": "Fall Guys by Mediatonic. Tags: Battle Royale, Party Game, Multiplayer, Casual Released: 2020-08-04. Price: $0.00"
    },
    {
        "GameID": 14,
        "Title": "Hollow Knight",
        "Developer": "Team Cherry",
        "Price": 14.99,
        "ReleaseDate": "2017-02-24",
        "Tags": "Metroidvania, Indie, Difficult, Atmospheric",
        "Description": "Hollow Knight by Team Cherry. Tags: Metroidvania, Indie, Difficult, Atmospheric Released: 2017-02-24. Price: $14.99"
    },
    {
        "GameID": 15,
        "Title": "Valorant",
        "Developer": "Riot Games",
        "Price": 0,
        "ReleaseDate": "2020-06-02",
        "Tags": "FPS, Competitive, Multiplayer, Tactical",
        "Description": "Valorant by Riot Games. Tags: FPS, Competitive, Multiplayer, Tactical Released: 2020-06-02. Price: $0.00"
    },
    {
        "GameID": 16,
        "Title": "Elden Ring",
        "Developer": "FromSoftware",
        "Price": 59.99,
        "ReleaseDate": "2022-02-25",
        "Tags": "Souls-like, Open World, RPG, Difficult",
        "Description": "Elden Ring by FromSoftware. Tags: Souls-like, Open World, RPG, Difficult Released: 2022-02-25. Price: $59.99"
    },
    {
        "GameID": 17,
        "Title": "Red Dead Redemption 2",
        "Developer": "Rockstar Games",
        "Price": 59.99,
        "ReleaseDate": "2018-10-26",
        "Tags": "Western, Open World, Story Rich, Action",
        "Description": "Red Dead Redemption 2 by Rockstar Games. Tags: Western, Open World, Story Rich, Action Released: 2018-10-26. Price: $59.99"
    },
    {
        "GameID": 18,
        "Title": "Dark Souls III",
        "Developer": "FromSoftware",
        "Price": 39.99,
        "ReleaseDate": "2016-04-11",
        "Tags": "Souls-like, RPG, Difficult, Dark Fantasy",
        "Description": "Dark Souls III by FromSoftware. Tags: Souls-like, RPG, Difficult, Dark Fantasy Released: 2016-04-11. Price: $39.99"
    },
    {
        "GameID": 19,
        "Title": "League of Legends",
        "Developer": "Riot Games",
        "Price": 0,
        "ReleaseDate": "2009-10-27",
        "Tags": "MOBA, Competitive, Multiplayer, Strategy",
        "Description": "League of Legends by Riot Games. Tags: MOBA, Competitive, Multiplayer, Strategy Released: 2009-10-27. Price: $0.00"
    },
    {
        "GameID": 20,
        "Title": "God of War",
        "Developer": "Santa Monica Studio",
        "Price": 49.99,
        "ReleaseDate": "2018-04-20",
        "Tags": "Action, Adventure, Story Rich, Norse Mythology",
        "Description": "God of War by Santa Monica Studio. Tags: Action, Adventure, Story Rich, Norse Mythology Released: 2018-04-20. Price: $49.99"
    },
    {
        "GameID": 21,
        "Title": "DOOM Eternal",
        "Developer": "id Software",
        "Price": 39.99,
        "ReleaseDate": "2020-03-20",
        "Tags": "FPS, Action, Fast-Paced, Demons",
        "Description": "DOOM Eternal by id Software. Tags: FPS, Action, Fast-Paced, Demons Released: 2020-03-20. Price: $39.99"
    },
    {
        "GameID": 22,
        "Title": "Fortnite",
        "Developer": "Epic Games",
        "Price": 0,
        "ReleaseDate": "2017-07-25",
        "Tags": "Battle Royale, Building, Multiplayer, Shooter",
        "Description": "Fortnite by Epic Games. Tags: Battle Royale, Building, Multiplayer, Shooter Released: 2017-07-25. Price: $0.00"
    },
    {
        "GameID": 23,
        "Title": "Apex Legends",
        "Developer": "Respawn Entertainment",
        "Price": 0,
        "ReleaseDate": "2019-02-04",
        "Tags": "Battle Royale, FPS, Hero Shooter, Multiplayer",
        "Description": "Apex Legends by Respawn Entertainment. Tags: Battle Royale, FPS, Hero Shooter, Multiplayer Released: 2019-02-04. Price: $0.00"
    },
    {
        "GameID": 24,
        "Title": "Overwatch 2",
        "Developer": "Blizzard Entertainment",
        "Price": 0,
        "ReleaseDate": "2022-10-04",
        "Tags": "Hero Shooter, FPS, Team-Based, Competitive",
        "Description": "Overwatch 2 by Blizzard Entertainment. Tags: Hero Shooter, FPS, Team-Based, Competitive Released: 2022-10-04. Price: $0.00"
    },
    {
        "GameID": 25,
        "Title": "Rocket League",
        "Developer": "Psyonix",
        "Price": 0,
        "ReleaseDate": "2015-07-07",
        "Tags": "Sports, Cars, Multiplayer, Competitive",
        "Description": "Rocket League by Psyonix. Tags: Sports, Cars, Multiplayer, Competitive Released: 2015-07-07. Price: $0.00"
    },
    {
        "GameID": 26,
        "Title": "Grand Theft Auto V",
        "Developer": "Rockstar Games",
        "Price": 29.99,
        "ReleaseDate": "2013-09-17",
        "Tags": "Open World, Action, Crime, Multiplayer",
        "Description": "Grand Theft Auto V by Rockstar Games. Tags: Open World, Action, Crime, Multiplayer Released: 2013-09-17. Price: $29.99"
    },
    {
        "GameID": 27,
        "Title": "The Last of Us Part I",
        "Developer": "Naughty Dog",
        "Price": 59.99,
        "ReleaseDate": "2022-09-02",
        "Tags": "Survival, Story Rich, Post-Apocalyptic, Action",
        "Description": "The Last of Us Part I by Naughty Dog. Tags: Survival, Story Rich, Post-Apocalyptic, Action Released: 2022-09-02. Price: $59.99"
    },
    {
        "GameID": 28,
        "Title": "Skyrim",
        "Developer": "Bethesda Game Studios",
        "Price": 39.99,
        "ReleaseDate": "2011-11-11",
        "Tags": "RPG, Open World, Fantasy, Dragons",
        "Description": "Skyrim by Bethesda Game Studios. Tags: RPG, Open World, Fantasy, Dragons Released: 2011-11-11. Price: $39.99"
    },
    {
        "GameID": 29,
        "Title": "Starfield",
        "Developer": "Bethesda Game Studios",
        "Price": 69.99,
        "ReleaseDate": "2023-09-06",
        "Tags": "RPG, Space, Sci-Fi, Open World",
        "Description": "Starfield by Bethesda Game Studios. Tags: RPG, Space, Sci-Fi, Open World Released: 2023-09-06. Price: $69.99"
    },
    {
        "GameID": 30,
        "Title": "Destiny 2",
        "Developer": "Bungie",
        "Price": 0,
        "ReleaseDate": "2017-09-06",
        "Tags": "Looter Shooter, MMO, Sci-Fi, Multiplayer",
        "Description": "Destiny 2 by Bungie. Tags: Looter Shooter, MMO, Sci-Fi, Multiplayer Released: 2017-09-06. Price: $0.00"
    },
    {
        "GameID": 31,
        "Title": "Disco Elysium",
        "Developer": "ZA/UM",
        "Price": 39.99,
        "ReleaseDate": "2019-10-15",
        "Tags": "RPG, Detective, Story Rich, Choice-Driven",
        "Description": "Disco Elysium by ZA/UM. Tags: RPG, Detective, Story Rich, Choice-Driven Released: 2019-10-15. Price: $39.99"
    },
    {
        "GameID": 32,
        "Title": "Undertale",
        "Developer": "Toby Fox",
        "Price": 9.99,
        "ReleaseDate": "2015-09-15",
        "Tags": "RPG, Indie, Retro, Choice-Driven",
        "Description": "Undertale by Toby Fox. Tags: RPG, Indie, Retro, Choice-Driven Released: 2015-09-15. Price: $9.99"
    },
    {
        "GameID": 33,
        "Title": "Dead by Daylight",
        "Developer": "Behaviour Interactive",
        "Price": 19.99,
        "ReleaseDate": "2016-06-14",
        "Tags": "Horror, Asymmetrical, Multiplayer, Survival",
        "Description": "Dead by Daylight by Behaviour Interactive. Tags: Horror, Asymmetrical, Multiplayer, Survival Released: 2016-06-14. Price: $19.99"
    },
    {
        "GameID": 34,
        "Title": "Resident Evil Village",
        "Developer": "Capcom",
        "Price": 39.99,
        "ReleaseDate": "2021-05-07",
        "Tags": "Horror, Survival, Action, First Person",
        "Description": "Resident Evil Village by Capcom. Tags: Horror, Survival, Action, First Person Released: 2021-05-07. Price: $39.99"
    },
    {
        "GameID": 35,
        "Title": "Sekiro: Shadows Die Twice",
        "Developer": "FromSoftware",
        "Price": 59.99,
        "ReleaseDate": "2019-03-22",
        "Tags": "Souls-like, Action, Difficult, Samurai",
        "Description": "Sekiro: Shadows Die Twice by FromSoftware. Tags: Souls-like, Action, Difficult, Samurai Released: 2019-03-22. Price: $59.99"
    },
    {
        "GameID": 36,
        "Title": "Civilization VI",
        "Developer": "Firaxis Games",
        "Price": 59.99,
        "ReleaseDate": "2016-10-21",
        "Tags": "Strategy, Turn-Based, 4X, Historical",
        "Description": "Civilization VI by Firaxis Games. Tags: Strategy, Turn-Based, 4X, Historical Released: 2016-10-21. Price: $59.99"
    },
    {
        "GameID": 37,
        "Title": "Total War: Warhammer III",
        "Developer": "Creative Assembly",
        "Price": 59.99,
        "ReleaseDate": "2022-02-17",
        "Tags": "Strategy, RTS, Fantasy, War",
        "Description": "Total War: Warhammer III by Creative Assembly. Tags: Strategy, RTS, Fantasy, War Released: 2022-02-17. Price: $59.99"
    },
    {
        "GameID": 38,
        "Title": "Crusader Kings III",
        "Developer": "Paradox Development Studio",
        "Price": 49.99,
        "ReleaseDate": "2020-09-01",
        "Tags": "Grand Strategy, Medieval, Role-Playing, Management",
        "Description": "Crusader Kings III by Paradox Development Studio. Tags: Grand Strategy, Medieval, Role-Playing, Management Released: 2020-09-01. Price: $49.99"
    },
    {
        "GameID": 39,
        "Title": "Sea of Thieves",
        "Developer": "Rare",
        "Price": 39.99,
        "ReleaseDate": "2018-03-20",
        "Tags": "Pirates, Multiplayer, Adventure, Open World",
        "Description": "Sea of Thieves by Rare. Tags: Pirates, Multiplayer, Adventure, Open World Released: 2018-03-20. Price: $39.99"
    },
    {
        "GameID": 40,
        "Title": "Monster Hunter: World",
        "Developer": "Capcom",
        "Price": 29.99,
        "ReleaseDate": "2018-01-26",
        "Tags": "Action, RPG, Co-op, Monster Hunting",
        "Description": "Monster Hunter: World by Capcom. Tags: Action, RPG, Co-op, Monster Hunting Released: 2018-01-26. Price: $29.99"
    },
    {
        "GameID": 41,
        "Title": "It Takes Two",
        "Developer": "Hazelight Studios",
        "Price": 39.99,
        "ReleaseDate": "2021-03-26",
        "Tags": "Co-op, Adventure, Split Screen, Story Rich",
        "Description": "It Takes Two by Hazelight Studios. Tags: Co-op, Adventure, Split Screen, Story Rich Released: 2021-03-26. Price: $39.99"
    },
    {
        "GameID": 42,
        "Title": "Cities: Skylines",
        "Developer": "Colossal Order",
        "Price": 29.99,
        "ReleaseDate": "2015-03-10",
        "Tags": "City Builder, Simulation, Management, Strategy",
        "Description": "Cities: Skylines by Colossal Order. Tags: City Builder, Simulation, Management, Strategy Released: 2015-03-10. Price: $29.99"
    },
    {
        "GameID": 43,
        "Title": "Subnautica",
        "Developer": "Unknown Worlds Entertainment",
        "Price": 29.99,
        "ReleaseDate": "2018-01-23",
        "Tags": "Survival, Underwater, Exploration, Crafting",
        "Description": "Subnautica by Unknown Worlds Entertainment. Tags: Survival, Underwater, Exploration, Crafting Released: 2018-01-23. Price: $29.99"
    },
    {
        "GameID": 44,
        "Title": "The Sims 4",
        "Developer": "Maxis",
        "Price": 0,
        "ReleaseDate": "2014-09-02",
        "Tags": "Life Simulation, Building, Casual, Creative",
        "Description": "The Sims 4 by Maxis. Tags: Life Simulation, Building, Casual, Creative Released: 2014-09-02. Price: $0.00"
    },
    {
        "GameID": 45,
        "Title": "Genshin Impact",
        "Developer": "HoYoverse",
        "Price": 0,
        "ReleaseDate": "2020-09-28",
        "Tags": "Action RPG, Anime, Open World, Gacha",
        "Description": "Genshin Impact by HoYoverse. Tags: Action RPG, Anime, Open World, Gacha Released: 2020-09-28. Price: $0.00"
    },
    {
        "GameID": 46,
        "Title": "Spider-Man Remastered",
        "Developer": "Insomniac Games",
        "Price": 59.99,
        "ReleaseDate": "2022-08-12",
        "Tags": "Action, Open World, Superhero, Story Rich",
        "Description": "Spider-Man Remastered by Insomniac Games. Tags: Action, Open World, Superhero, Story Rich Released: 2022-08-12. Price: $59.99"
    },
    {
        "GameID": 47,
        "Title": "Deep Rock Galactic",
        "Developer": "Ghost Ship Games",
        "Price": 29.99,
        "ReleaseDate": "2020-05-13",
        "Tags": "Co-op, FPS, Mining, Dwarves",
        "Description": "Deep Rock Galactic by Ghost Ship Games. Tags: Co-op, FPS, Mining, Dwarves Released: 2020-05-13. Price: $29.99"
    },
    {
        "GameID": 48,
        "Title": "Risk of Rain 2",
        "Developer": "Hopoo Games",
        "Price": 24.99,
        "ReleaseDate": "2020-08-11",
        "Tags": "Roguelike, Co-op, Third Person, Action",
        "Description": "Risk of Rain 2 by Hopoo Games. Tags: Roguelike, Co-op, Third Person, Action Released: 2020-08-11. Price: $24.99"
    },
    {
        "GameID": 49,
        "Title": "Valheim",
        "Developer": "Iron Gate Studio",
        "Price": 19.99,
        "ReleaseDate": "2021-02-02",
        "Tags": "Survival, Viking, Co-op, Building",
        "Description": "Valheim by Iron Gate Studio. Tags: Survival, Viking, Co-op, Building Released: 2021-02-02. Price: $19.99"
    },
    {
        "GameID": 50,
        "Title": "Phasmophobia",
        "Developer": "Kinetic Games",
        "Price": 13.99,
        "ReleaseDate": "2020-09-18",
        "Tags": "Horror, Co-op, Ghost Hunting, Multiplayer",
        "Description": "Phasmophobia by Kinetic Games. Tags: Horror, Co-op, Ghost Hunting, Multiplayer Released: 2020-09-18. Price: $13.99"
    },
    {
        "GameID": 52,
        "Title": "Five Nights at Freddy's",
        "Developer": "Scott Cawthon",
        "Price": 5,
        "ReleaseDate": "2014-08-08",
        "Tags": "Indie game, Survival horror, Simulation video game, Action-adventure game, Graphic adventure game",
        "Description": "Five Nights at Freddy's by Scott Cawthon. Tags: Indie game, Survival horror, Simulation video game, Action-adventure game, Graphic adventure game Released: 2014-08-08. Price: $5"
    }
];

module.exports = mockGames;
