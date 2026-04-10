import React, { useState, useMemo, useEffect } from "react";

const FIPS_TO_ABBR = {"01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE","11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA","20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA","54":"WV","55":"WI","56":"WY"};

const S = {
  AL:{name:"Alabama",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"SB 257 (2026) proposes constitutional amendment for lottery, casinos, and mobile sports betting; needs supermajority.",sources:[{label:"CBS Sports – 50 States (2026)",url:"https://www.cbssports.com/betting/news/u-s-sports-betting-where-all-50-states-stand-on-legalizing-online-sports-betting-sites-proposed-legislation/"}]},
  AK:{name:"Alaska",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"HB 145 (Mar 2025) proposed 10 mobile licenses; no forward motion.",sources:[{label:"CBS Sports – 50 States",url:"https://www.cbssports.com/betting/news/u-s-sports-betting-where-all-50-states-stand-on-legalizing-online-sports-betting-sites-proposed-legislation/"}]},
  AZ:{name:"Arizona",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature (HB 2772)",yearLegalized:2021,yearLaunched:2021,taxRate:"10% online / 8% retail",regulator:"AZ Dept. of Gaming",operators:["DraftKings","FanDuel","BetMGM","Caesars","bet365","Fanatics","BetRivers","ESPN Bet","SuperBook","Betfred"],collegeBetting:"All teams allowed",collegeProps:"Banned (team & player)",restrictions:"Up to 20 licenses (18 issued). Both tribal and commercial operators.",sources:[{label:"AZ Dept. of Gaming",url:"https://gaming.az.gov/"},{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  AR:{name:"Arkansas",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Ballot (Issue 4, 2018)",yearLegalized:2018,yearLaunched:2019,taxRate:"13% (first $150M) / 20% (above)",regulator:"AR Racing Commission",operators:["DraftKings","FanDuel","BETSaracen"],collegeBetting:"No restrictions",collegeProps:"Allowed",restrictions:"51-49% revenue split favoring in-state casinos. Tax is 13% on first $150M net casino revenue per fiscal year, 20% above that.",sources:[{label:"SportsHandle",url:"https://sportshandle.com/sports-betting-revenue/"},{label:"BettingUSA",url:"https://www.bettingusa.com/sports/taxes-and-licenses/"}]},
  CA:{name:"California",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"Prop 26 & 27 rejected Nov 2022. No viable path before 2028.",sources:[{label:"GamingToday",url:"https://www.gamingtoday.com/sports-betting/states/"}]},
  CO:{name:"Colorado",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Ballot (Nov 2019)",yearLegalized:2019,yearLaunched:2020,taxRate:"10%",regulator:"CO Div. of Gaming",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","bet365","Fanatics","SuperBook","Circa","Betfred"],collegeBetting:"All teams allowed",collegeProps:"Banned",restrictions:"Statutory 10% rate; effective rate has been ~5.4% due to promo deductions, but promo write-offs are being phased out and fully sunset by July 2026. 33 casinos eligible.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"},{label:"BettingUSA",url:"https://www.bettingusa.com/sports/taxes-and-licenses/"}]},
  CT:{name:"Connecticut",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature + Tribal compact",yearLegalized:2021,yearLaunched:2021,taxRate:"13.75%",regulator:"CT Dept. of Consumer Protection",operators:["DraftKings","FanDuel","Fanatics"],collegeBetting:"No in-state teams (except tournaments)",collegeProps:"Follows in-state ban",restrictions:"Hybrid: tribal casinos + lottery. Must partner with master gaming operator.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  DE:{name:"Delaware",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Existing law (grandfathered)",yearLegalized:2018,yearLaunched:2018,taxRate:"50%",regulator:"DE Lottery",operators:["BetRivers"],collegeBetting:"No in-state teams",collegeProps:"Follows in-state ban",restrictions:"First state outside NV to accept single-game bet (June 2018). Online via BetRivers since Jan 2024.",sources:[{label:"SportsHandle",url:"https://sportshandle.com/sports-betting-revenue/"}]},
  DC:{name:"Washington D.C.",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"DC Council",yearLegalized:2018,yearLaunched:2020,taxRate:"30%",regulator:"DC Office of Lottery & Gaming",operators:["GambetDC","Caesars","BetMGM"],collegeBetting:"No DC teams or events",collegeProps:"Follows restrictions",restrictions:"Two-tier: lottery app (GambetDC) citywide; private operators geofenced to venues. Tax rate set to 30% on most online sports betting since Aug 2024.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  FL:{name:"Florida",status:"legal_online",statusLabel:"Legal – Tribal Monopoly",channels:"Online + Retail (tribal)",legalMethod:"Tribal compact (2021)",yearLegalized:2021,yearLaunched:2023,taxRate:"Revenue-share",regulator:"Seminole Tribe / FL Gaming Commission",operators:["Hard Rock Bet"],collegeBetting:"All teams allowed",collegeProps:"Banned",restrictions:"Hard Rock Bet sole mobile operator. Relaunched Dec 2023.",sources:[{label:"OddsMatrix",url:"https://oddsmatrix.com/legal-sports-betting/"}]},
  GA:{name:"Georgia",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"Top 'watch' for 2026. Pro team owners lobbying. Could pass end of 2026.",sources:[{label:"Iredell Free News",url:"https://www.iredellfreenews.com/lifestyles/2026/sports-betting-legalization-news-2026-state-by-state-bill-tracker/"}]},
  HI:{name:"Hawaii",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"All gambling prohibited. Multiple 2025 bills failed.",sources:[{label:"CBS Sports",url:"https://www.cbssports.com/betting/news/u-s-sports-betting-where-all-50-states-stand-on-legalizing-online-sports-betting-sites-proposed-legislation/"}]},
  ID:{name:"Idaho",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"No sports betting bills introduced during 2025 legislative session. No active path to legalization.",sources:[{label:"CBS Sports",url:"https://www.cbssports.com/betting/news/u-s-sports-betting-where-all-50-states-stand-on-legalizing-online-sports-betting-sites-proposed-legislation/"}]},
  IL:{name:"Illinois",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2019,yearLaunched:2020,taxRate:"Graduated 20–40% + per-wager fee",regulator:"IL Gaming Board",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics","ESPN Bet","bet365","Hard Rock Bet"],collegeBetting:"No in-state teams (since July 2024)",collegeProps:"Banned",restrictions:"Tax hiked to graduated 20–40%. Chicago adds 2%. Per-wager fee: $0.25 on first 20M wagers, $0.50 beyond (eff. July 2025).",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"},{label:"BettingUSA",url:"https://www.bettingusa.com/sports/taxes-and-licenses/"}]},
  IN:{name:"Indiana",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2019,yearLaunched:2019,taxRate:"9.5%",regulator:"IN Gaming Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics","bet365","Hard Rock Bet"],collegeBetting:"All teams allowed",collegeProps:"Pre-game only (no live)",restrictions:"No live in-play college player props. D-I only.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  IA:{name:"Iowa",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2019,yearLaunched:2019,taxRate:"6.75%",regulator:"IA Racing & Gaming Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","bet365","Q Sportsbook"],collegeBetting:"All teams allowed",collegeProps:"No props on in-state athletes",restrictions:"Lowest tax rate (tied NV). In-person registration removed 2021.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  KS:{name:"Kansas",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2022,yearLaunched:2022,taxRate:"10%",regulator:"KS Racing & Gaming Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics"],collegeBetting:"No restrictions",collegeProps:"Allowed",restrictions:"Up to 6 mobile operators.",sources:[{label:"OddsMatrix",url:"https://oddsmatrix.com/legal-sports-betting/"}]},
  KY:{name:"Kentucky",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature (HB 606)",yearLegalized:2023,yearLaunched:2023,taxRate:"14.25%",regulator:"KY Horse Racing Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","bet365","Fanatics"],collegeBetting:"No restrictions",collegeProps:"Allowed (HB 904 pending)",restrictions:"HB 904 (2026) would ban in-state athlete props & raise age to 21.",sources:[{label:"BettorsInsider",url:"https://bettorsinsider.com/news/2026/03/23/prop-bet-bans-are-coming-louisiana-kentucky-minnesota-target-college-player-props/"}]},
  LA:{name:"Louisiana",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature + parish vote",yearLegalized:2020,yearLaunched:2022,taxRate:"21.5%",regulator:"LA Gaming Control Board",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics","bet365"],collegeBetting:"All teams allowed",collegeProps:"Banned (Aug 2024)",restrictions:"55/64 parishes voted yes. Tax increased to 21.5% in 2025.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  ME:{name:"Maine",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2022,yearLaunched:2023,taxRate:"10%",regulator:"ME Gambling Control Unit",operators:["DraftKings","FanDuel","Caesars","BetMGM"],collegeBetting:"No in-state teams (incl. tournaments)",collegeProps:"Follows in-state ban",restrictions:"Online sweepstakes & credit card funding banned 2026.",sources:[{label:"BMR",url:"https://www.bookmakersreview.com/industry/maine-online-gambling-laws-2026/"}]},
  MD:{name:"Maryland",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Ballot (2020) + Legislature",yearLegalized:2020,yearLaunched:2022,taxRate:"20%",regulator:"MD Lottery & Gaming",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics","bet365","Hard Rock Bet","ESPN Bet"],collegeBetting:"All teams allowed",collegeProps:"Banned (March 2024)",restrictions:"Tax rate increased to 20% in 2025.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  MA:{name:"Massachusetts",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2022,yearLaunched:2023,taxRate:"20%",regulator:"MA Gaming Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","ESPN Bet","Fanatics","bet365"],collegeBetting:"No in-state (except tournaments)",collegeProps:"Banned",restrictions:"$5M license fee. Reopening new licenses Apr 2026.",sources:[{label:"BMR",url:"https://www.bookmakersreview.com/industry/massachusetts-reopens-sports-betting-licenses/"}]},
  MI:{name:"Michigan",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2019,yearLaunched:2021,taxRate:"8.4%",regulator:"MI Gaming Control Board",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics","bet365","WynnBet"],collegeBetting:"No restrictions",collegeProps:"Allowed",restrictions:"One of most open markets. Also has iGaming. Targeting offshore books 2026.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  MN:{name:"Minnesota",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"Tribal opposition primary obstacle. SF 4139 (2026) would legalize via tribal partnerships with prop ban.",sources:[{label:"BettorsInsider",url:"https://bettorsinsider.com/news/2026/03/23/prop-bet-bans-are-coming-louisiana-kentucky-minnesota-target-college-player-props/"}]},
  MS:{name:"Mississippi",status:"legal_retail",statusLabel:"Legal – Retail Only",channels:"Retail (on-premise mobile)",legalMethod:"Legislature",yearLegalized:2017,yearLaunched:2018,taxRate:"12%",regulator:"MS Gaming Commission",operators:["BetMGM (on-premise)","Caesars (on-premise)","casino sportsbooks"],collegeBetting:"In-state allowed",collegeProps:"Allowed at retail",restrictions:"No statewide online. App-based betting only at licensed casinos.",sources:[{label:"SportsHandle",url:"https://sportshandle.com/sports-betting-revenue/"}]},
  MO:{name:"Missouri",status:"legal_online",statusLabel:"Legal – Online & Retail (Dec 2025)",channels:"Online + Retail",legalMethod:"Ballot (Nov 2024)",yearLegalized:2024,yearLaunched:2025,taxRate:"10%",regulator:"MO Gaming Commission",operators:["BetMGM","DraftKings","FanDuel","bet365","Fanatics","Caesars","theScore Bet","Circa"],collegeBetting:"TBD (MGC finalizing)",collegeProps:"TBD",restrictions:"39th state live (Dec 1, 2025). Eight sportsbooks launched at go-live. College betting rules still being finalized by MGC.",sources:[{label:"AP News",url:"https://apnews.com/article/sports-betting-prop-bets-missouri-f7be83cb51fb9be828089f005f83075e"}]},
  MT:{name:"Montana",status:"legal_retail",statusLabel:"Legal – On-Premise Only",channels:"Retail (on-premise app)",legalMethod:"Existing law (grandfathered)",yearLegalized:2019,yearLaunched:2020,taxRate:"Lottery revenue-share",regulator:"MT Lottery",operators:["Sports Bet Montana"],collegeBetting:"Allowed incl. props",collegeProps:"Allowed",restrictions:"State lottery monopoly. Must be at retail location to place wager.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  NE:{name:"Nebraska",status:"legal_retail",statusLabel:"Legal – Retail Only",channels:"Retail only",legalMethod:"Legislature (LB 561)",yearLegalized:2021,yearLaunched:2023,taxRate:"20%",regulator:"NE Racing & Gaming Commission",operators:["WarHorse Casino","Grand Island Casino Resort"],collegeBetting:"No in-state teams",collegeProps:"Banned",restrictions:"No online. 6 new casinos authorized. 2026 mobile ballot possible.",sources:[{label:"GamingToday",url:"https://www.gamingtoday.com/sports-betting/states/"}]},
  NV:{name:"Nevada",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Existing law (since 1949)",yearLegalized:1949,yearLaunched:1949,taxRate:"6.75%",regulator:"NV Gaming Control Board",operators:["Caesars","BetMGM","DraftKings","FanDuel","Circa","SuperBook","Westgate","200+ retail"],collegeBetting:"No restrictions",collegeProps:"Allowed",restrictions:"Lowest tax rate (tied IA). ~200 retail locations. In-person registration required.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  NH:{name:"New Hampshire",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2019,yearLaunched:2019,taxRate:"51%",regulator:"NH Lottery Commission",operators:["DraftKings (exclusive)"],collegeBetting:"No in-state teams/events",collegeProps:"Allowed (outside in-state)",restrictions:"DraftKings monopoly. 51% tax rate.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  NJ:{name:"New Jersey",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature (post-Murphy v. NCAA)",yearLegalized:2018,yearLaunched:2018,taxRate:"19.75% online / 9.75% retail",regulator:"NJ Div. of Gaming Enforcement",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics","bet365","Unibet","Hard Rock Bet","Resorts Digital"],collegeBetting:"No in-state teams/events",collegeProps:"Allowed (outside in-state)",restrictions:"Pioneer state. Must partner with brick-and-mortar. Unified 19.75% online rate eff. July 2025 (up from 13%).",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"},{label:"BettingUSA",url:"https://www.bettingusa.com/sports/taxes-and-licenses/"}]},
  NM:{name:"New Mexico",status:"legal_retail",statusLabel:"Legal – Tribal Only",channels:"Tribal casinos only",legalMethod:"Tribal compact",yearLegalized:null,yearLaunched:2018,taxRate:"N/A (tribal)",regulator:"Tribal authorities",operators:["Various tribal sportsbooks"],collegeBetting:"No in-state teams",collegeProps:"Tribal rules",restrictions:"No state legislation. Tribal casinos only.",sources:[{label:"BMR",url:"https://www.bookmakersreview.com/usa/new-mexico/"}]},
  NY:{name:"New York",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2021,yearLaunched:2022,taxRate:"51%",regulator:"NY State Gaming Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","Fanatics","bet365","BetRivers","WynnBet","Resorts World"],collegeBetting:"No in-state teams",collegeProps:"Banned (all college)",restrictions:"51% tax, $25M license. Over $1B tax revenue in 2024.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"},{label:"Withum",url:"https://www.withum.com/resources/how-states-tax-sports-betting-a-comparative-analysis/"}]},
  NC:{name:"North Carolina",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2023,yearLaunched:2024,taxRate:"18%",regulator:"NC State Lottery Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","ESPN Bet","Fanatics","bet365","Hard Rock Bet"],collegeBetting:"No restrictions",collegeProps:"Allowed",restrictions:"Online launched March 11, 2024.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  ND:{name:"North Dakota",status:"legal_retail",statusLabel:"Legal – Tribal Only",channels:"Tribal casinos only",legalMethod:"Tribal compact",yearLegalized:null,yearLaunched:null,taxRate:"N/A (tribal)",regulator:"Tribal authorities",operators:["Tribal sportsbooks"],collegeBetting:"Varies by operator",collegeProps:"Varies",restrictions:"Tribal-only. HCR 3002, a legislative resolution to place online sports betting on the ballot, was defeated in the House 63-24 in early 2025. Voters never saw it.",sources:[{label:"PokerScout",url:"https://www.pokerscout.com/guides/sports-betting-state-tracker/"}]},
  OH:{name:"Ohio",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature (HB 29)",yearLegalized:2021,yearLaunched:2023,taxRate:"20%",regulator:"OH Casino Control Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","bet365","Fanatics","Hard Rock Bet","ESPN Bet","many more"],collegeBetting:"In-state allowed",collegeProps:"Banned (Feb 2024)",restrictions:"Most online sportsbooks of any state. Can partner with pro sports orgs.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  OK:{name:"Oklahoma",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"Two House bills failed in Senate. Talks resuming 2026.",sources:[{label:"PokerScout",url:"https://www.pokerscout.com/guides/sports-betting-state-tracker/"}]},
  OR:{name:"Oregon",status:"legal_online",statusLabel:"Legal – Online (Lottery)",channels:"Online (lottery-run)",legalMethod:"Existing law (grandfathered)",yearLegalized:2019,yearLaunched:2019,taxRate:"51% (lottery)",regulator:"OR Lottery",operators:["DraftKings (exclusive)"],collegeBetting:"Banned on state platform",collegeProps:"Banned on state platform",restrictions:"OR Lottery bans all college sports betting on the DraftKings state platform. Tribal retail casinos may accept college wagers under separate authority. DraftKings is sole mobile operator.",sources:[{label:"Bleacher Nation",url:"https://www.bleachernation.com/betting/2026/03/05/college-player-props/"}]},
  PA:{name:"Pennsylvania",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2017,yearLaunched:2018,taxRate:"36%",regulator:"PA Gaming Control Board",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics","bet365","Unibet","BetParx","Betway"],collegeBetting:"All teams incl. in-state",collegeProps:"Banned",restrictions:"$10M license fee. Effective rate ~24.6% after promo deductions.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"},{label:"BettingUSA",url:"https://www.bettingusa.com/sports/taxes-and-licenses/"}]},
  RI:{name:"Rhode Island",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2018,yearLaunched:2018,taxRate:"51%",regulator:"RI Dept. of Business Regulation",operators:["Bally Bet"],collegeBetting:"No in-state teams/events",collegeProps:"Follows in-state ban",restrictions:"51% tax. Small market.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  SC:{name:"South Carolina",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"No active legislation.",sources:[{label:"BMR",url:"https://www.bookmakersreview.com/usa/"}]},
  SD:{name:"South Dakota",status:"legal_retail",statusLabel:"Legal – Retail (Deadwood + Tribal)",channels:"Retail only",legalMethod:"Ballot (Nov 2020)",yearLegalized:2020,yearLaunched:2021,taxRate:"9%",regulator:"SD Commission on Gaming",operators:["Deadwood sportsbooks","Tribal sportsbooks"],collegeBetting:"No in-state teams",collegeProps:"Banned",restrictions:"Deadwood + tribal only. 2026 mobile ballot possible.",sources:[{label:"SportsHandle",url:"https://sportshandle.com/sports-betting-revenue/"}]},
  TN:{name:"Tennessee",status:"legal_online",statusLabel:"Legal – Online Only",channels:"Online only",legalMethod:"Legislature (HB 1)",yearLegalized:2019,yearLaunched:2020,taxRate:"1.85% on handle (~20% GGR)",regulator:"TN Sports Wagering Advisory Council",operators:["DraftKings","FanDuel","BetMGM","Caesars","ESPN Bet","Fanatics","Hard Rock Bet","bet365"],collegeBetting:"In-state allowed",collegeProps:"Banned (+ no in-play team props)",restrictions:"Online-only. First state to tax on handle instead of GGR.",sources:[{label:"BettingUSA",url:"https://www.bettingusa.com/sports/taxes-and-licenses/"}]},
  TX:{name:"Texas",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"Lt. Gov. blocking. Jerry Jones lobbying. Realistic: 2027-2028 ballot.",sources:[{label:"Iredell Free News",url:"https://www.iredellfreenews.com/lifestyles/2026/sports-betting-legalization-news-2026-state-by-state-bill-tracker/"}]},
  UT:{name:"Utah",status:"not_legal",statusLabel:"Not Legal",channels:"—",legalMethod:"—",yearLegalized:null,yearLaunched:null,taxRate:"—",regulator:"—",operators:[],collegeBetting:"—",collegeProps:"—",restrictions:"Constitution bans gambling. Criminal code preemptively blocks online. No prospects.",sources:[{label:"PokerScout",url:"https://www.pokerscout.com/guides/sports-betting-state-tracker/"}]},
  VT:{name:"Vermont",status:"legal_online",statusLabel:"Legal – Online Only",channels:"Online only",legalMethod:"Legislature",yearLegalized:2023,yearLaunched:2024,taxRate:"≥20% rev share",regulator:"VT Dept. of Liquor & Lottery",operators:["DraftKings","FanDuel","Fanatics"],collegeBetting:"No in-state (except tournaments)",collegeProps:"Banned",restrictions:"$550K fee. Operators committed above 20% minimum.",sources:[{label:"Withum",url:"https://www.withum.com/resources/how-states-tax-sports-betting-a-comparative-analysis/"}]},
  VA:{name:"Virginia",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2020,yearLaunched:2021,taxRate:"15%",regulator:"VA Lottery Board",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics","bet365","Hard Rock Bet"],collegeBetting:"No in-state teams",collegeProps:"Banned (all college)",restrictions:"Multiple attempts to reverse in-state ban have failed.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
  WA:{name:"Washington",status:"legal_retail",statusLabel:"Legal – Tribal Only",channels:"Tribal casinos only",legalMethod:"Legislature + Tribal compact",yearLegalized:2020,yearLaunched:2021,taxRate:"N/A (tribal)",regulator:"WA Gambling Commission",operators:["Various tribal sportsbooks"],collegeBetting:"No in-state teams",collegeProps:"Banned",restrictions:"SB 6137 (2026) passed Senate 41-8 to allow in-state college bets with player prop ban.",sources:[{label:"OddsShark",url:"https://www.oddsshark.com/industry-news/washington-bill-allowing-college-betting-ban-props"}]},
  WV:{name:"West Virginia",status:"legal_online",statusLabel:"Legal – Online & Retail",channels:"Online + Retail",legalMethod:"Legislature",yearLegalized:2018,yearLaunched:2018,taxRate:"10%",regulator:"WV Lottery Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars","BetRivers","Fanatics"],collegeBetting:"No restrictions",collegeProps:"Allowed",restrictions:"10% tax, no promo deductions. Also has iGaming.",sources:[{label:"BettingUSA",url:"https://www.bettingusa.com/sports/taxes-and-licenses/"}]},
  WI:{name:"Wisconsin",status:"legal_retail",statusLabel:"Legal – Tribal Only",channels:"Tribal casinos (Oneida on-premise mobile)",legalMethod:"Tribal compact",yearLegalized:null,yearLaunched:null,taxRate:"N/A (tribal)",regulator:"Tribal authorities",operators:["Oneida Casino","Various tribal"],collegeBetting:"No in-state teams",collegeProps:"Tribal rules",restrictions:"6 tribal casinos. Oneida offers on-premise mobile.",sources:[{label:"BettorSafe",url:"https://bettorsafe.org/united-states-regulator-licensed-operators/"}]},
  WY:{name:"Wyoming",status:"legal_online",statusLabel:"Legal – Online Only",channels:"Online only",legalMethod:"Legislature",yearLegalized:2021,yearLaunched:2021,taxRate:"10%",regulator:"WY Gaming Commission",operators:["DraftKings","FanDuel","BetMGM","Caesars"],collegeBetting:"No restrictions",collegeProps:"Allowed",restrictions:"Online-only. Small but growing market.",sources:[{label:"Tax Foundation 2025",url:"https://taxfoundation.org/data/all/state/online-sports-betting-taxes/"}]},
};

const SC_MAP = { legal_online: { fill: "#0e7c3a", label: "Legal – Online/Mobile" }, legal_retail: { fill: "#d4a017", label: "Legal – Retail/Tribal Only" }, not_legal: { fill: "#b91c1c", label: "Not Legal" } };

const TOPO = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json";

export default function App() {
  const [topo, setTopo] = useState(null);
  const [sel, setSel] = useState(null);
  const [filt, setFilt] = useState("all");
  const [view, setView] = useState("map");
  const [q, setQ] = useState("");
  const [sc, setSc] = useState("name");
  const [sd, setSd] = useState("asc");
  const [hov, setHov] = useState(null);
  const [loadErr, setLoadErr] = useState(false);

  useEffect(() => { fetch(TOPO).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(setTopo).catch(() => setLoadErr(true)); }, []);

  const { paths, centers } = useMemo(() => {
    if (!topo) return { paths: {}, centers: {} };
    const t = topo, tr = t.transform, arcs = t.arcs;
    const decode = (arc) => { let x=0,y=0; return arc.map(p => { x+=p[0]; y+=p[1]; return [x*tr.scale[0]+tr.translate[0], y*tr.scale[1]+tr.translate[1]]; }); };
    const ring2pts = (ring) => { let pts=[]; ring.forEach(i => { const d = i<0 ? decode(arcs[~i]).reverse() : decode(arcs[i]); pts=pts.concat(d); }); return pts; };
    const toPath = (g) => {
      if (g.type==="Polygon") return g.arcs.map(r => { const p=ring2pts(r); return "M"+p.map(v=>v[0].toFixed(1)+","+v[1].toFixed(1)).join("L")+"Z"; }).join("");
      if (g.type==="MultiPolygon") return g.arcs.map(poly => poly.map(r => { const p=ring2pts(r); return "M"+p.map(v=>v[0].toFixed(1)+","+v[1].toFixed(1)).join("L")+"Z"; }).join("")).join("");
      return "";
    };
    const allPts = (g) => {
      let pts=[];
      const proc = r => r.forEach(i => { pts=pts.concat(i<0?decode(arcs[~i]).reverse():decode(arcs[i])); });
      if (g.type==="Polygon") g.arcs.forEach(proc);
      else if (g.type==="MultiPolygon") g.arcs.forEach(p=>p.forEach(proc));
      return pts;
    };
    const ps={}, cs={};
    t.objects.states.geometries.forEach(g => {
      const f=String(g.id).padStart(2,"0"), a=FIPS_TO_ABBR[f];
      if (!a) return;
      ps[a]=toPath(g);
      const pts=allPts(g);
      if (pts.length) { cs[a]=[pts.reduce((s,p)=>s+p[0],0)/pts.length, pts.reduce((s,p)=>s+p[1],0)/pts.length]; }
    });
    return { paths: ps, centers: cs };
  }, [topo]);

  const det = sel ? S[sel] : null;
  const tbl = useMemo(() => {
    let a = Object.entries(S).map(([k,v])=>({abbr:k,...v}));
    if (filt!=="all") a=a.filter(s=>s.status===filt);
    if (q) a=a.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.abbr.toLowerCase().includes(q.toLowerCase()));
    a.sort((x,y)=>{ let va=x[sc]??"",vb=y[sc]??""; if(typeof va==="string"){va=va.toLowerCase();vb=(vb||"").toString().toLowerCase();} return sd==="asc"?(va<vb?-1:va>vb?1:0):(va>vb?-1:va<vb?1:0); });
    return a;
  }, [filt,q,sc,sd]);

  const sortH = c => { if(sc===c) setSd(d=>d==="asc"?"desc":"asc"); else{setSc(c);setSd("asc");} };
  const m = "'JetBrains Mono',monospace";

  const [csvUrl, setCsvUrl] = useState(null);

  const generateCSV = () => {
    const headers = ["State","Abbr","Status","Channels","Legal Method","Year Legalized","Year Launched","Tax Rate","Regulator","Operators","College Betting","College Props","Restrictions","Sources"];
    const esc = v => { const s = String(v ?? "—"); return s.includes(",") || s.includes('"') || s.includes("\n") ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const rows = Object.entries(S).map(([abbr, s]) => [
      s.name, abbr, s.statusLabel, s.channels, s.legalMethod,
      s.yearLegalized || "—", s.yearLaunched || "—", s.taxRate, s.regulator,
      s.operators.join("; "), s.collegeBetting, s.collegeProps, s.restrictions,
      s.sources.map(src => src.label + ": " + src.url).join(" | ")
    ].map(esc).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    if (csvUrl) URL.revokeObjectURL(csvUrl);
    setCsvUrl(URL.createObjectURL(blob));
  };

  return (
    <div style={{fontFamily:"'Crimson Pro',Georgia,serif",background:"#0d1117",color:"#e6edf3",minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <div style={{background:"linear-gradient(135deg,#0d1117,#161b22,#1a1f2b)",borderBottom:"1px solid #30363d",padding:"32px 24px 24px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontSize:11,fontFamily:m,color:"#7c8594",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>Policy Tracker</div>
          <h1 style={{fontSize:32,fontWeight:700,margin:0,color:"#f0f6fc"}}>U.S. Sports Betting by State</h1>
          <p style={{fontSize:13,color:"#7c8594",margin:"8px 0 0",fontFamily:m}}>Legal status, operators, tax rates & restrictions — 50 states + D.C. • April 2026</p>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"20px 24px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",marginBottom:20}}>
          <div style={{display:"flex",gap:3,background:"#161b22",borderRadius:8,padding:3,border:"1px solid #30363d"}}>
            {["map","table"].map(v=><button key={v} onClick={()=>setView(v)} style={{padding:"6px 16px",fontSize:12,fontFamily:m,border:"none",borderRadius:6,cursor:"pointer",background:view===v?"#238636":"transparent",color:view===v?"#fff":"#7c8594",fontWeight:500,textTransform:"capitalize"}}>{v}</button>)}
          </div>
          <div style={{display:"flex",gap:3,background:"#161b22",borderRadius:8,padding:3,border:"1px solid #30363d"}}>
            {[{k:"all",l:"All"},{k:"legal_online",l:"Online"},{k:"legal_retail",l:"Retail/Tribal"},{k:"not_legal",l:"Not Legal"}].map(f=><button key={f.k} onClick={()=>setFilt(f.k)} style={{padding:"6px 12px",fontSize:11,fontFamily:m,border:"none",borderRadius:6,cursor:"pointer",background:filt===f.k?"#30363d":"transparent",color:filt===f.k?"#f0f6fc":"#7c8594",fontWeight:500}}>{f.l}</button>)}
          </div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" style={{padding:"7px 14px",fontSize:12,fontFamily:m,border:"1px solid #30363d",borderRadius:8,background:"#0d1117",color:"#e6edf3",outline:"none",width:150}}/>
          <button onClick={generateCSV} style={{padding:"6px 14px",fontSize:11,fontFamily:m,border:"1px solid #30363d",borderRadius:8,background:"#161b22",color:"#58a6ff",cursor:"pointer",fontWeight:500,whiteSpace:"nowrap"}}>↓ Export CSV</button>
          {csvUrl && <a href={csvUrl} download="sports-betting-by-state-2026.csv" style={{padding:"6px 14px",fontSize:11,fontFamily:m,border:"1px solid #238636",borderRadius:8,background:"#238636",color:"#fff",textDecoration:"none",fontWeight:500,whiteSpace:"nowrap"}}>Save CSV</a>}
          <div style={{marginLeft:"auto",display:"flex",gap:14,fontSize:11,fontFamily:m}}>
            {Object.entries(SC_MAP).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:2,background:v.fill}}/><span style={{color:"#7c8594"}}>{v.label}</span></div>)}
          </div>
        </div>

        {view==="map" && (
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 580px",minWidth:320}}>
              {!topo ? <div style={{background:"#161b22",borderRadius:12,padding:60,textAlign:"center",fontFamily:m,color:"#7c8594"}}>{loadErr ? "Failed to load map data. Please refresh." : "Loading map…"}</div> : (
                <svg viewBox="0 0 975 610" style={{width:"100%",height:"auto",display:"block"}}>
                  <rect width="975" height="610" fill="#0d1117" rx="8"/>
                  {Object.entries(paths).map(([a,d])=>{
                    const st=S[a]; if(!st) return null;
                    if(filt!=="all"&&st.status!==filt) return <path key={a} d={d} fill="#21262d" stroke="#0d1117" strokeWidth={0.5}/>;
                    const c=SC_MAP[st.status]?.fill||"#30363d", isSel=sel===a, isH=hov===a;
                    return <path key={a} d={d} fill={isSel?"#58a6ff":isH?"#58a6ff80":c} stroke={isSel?"#f0f6fc":"#0d1117"} strokeWidth={isSel?1.5:0.5} style={{cursor:"pointer",transition:"fill .12s"}} onClick={()=>setSel(a===sel?null:a)} onMouseEnter={()=>setHov(a)} onMouseLeave={()=>setHov(null)}/>;
                  })}
                  {Object.entries(centers).map(([a,[cx,cy]])=>{
                    const st=S[a]; if(!st||filt!=="all"&&st.status!==filt) return null;
                    return <text key={a} x={cx} y={cy} textAnchor="middle" dominantBaseline="central" style={{fontSize:7.5,fontFamily:m,fill:"#c9d1d9",pointerEvents:"none",fontWeight:500,opacity:.85}}>{a}</text>;
                  })}
                </svg>
              )}
            </div>
            <div style={{flex:"1 1 360px",minWidth:320,maxHeight:"72vh",overflowY:"auto"}}>
              {det ? (
                <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:12,padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,gap:12}}>
                    <h2 style={{margin:0,fontSize:22,fontWeight:700}}>{det.name}</h2>
                    <span style={{background:SC_MAP[det.status]?.fill,color:"#fff",padding:"3px 10px",borderRadius:20,fontSize:10,fontFamily:m,fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>{det.statusLabel}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px 16px",fontSize:13}}>
                    <F l="Channels" v={det.channels}/><F l="Legal Method" v={det.legalMethod}/>
                    <F l="Year Legalized" v={det.yearLegalized||"—"}/><F l="Year Launched" v={det.yearLaunched||"—"}/>
                    <F l="Tax Rate" v={det.taxRate}/><F l="Regulator" v={det.regulator}/>
                    <F l="College Betting" v={det.collegeBetting}/><F l="College Props" v={det.collegeProps}/>
                  </div>
                  {det.operators.length>0&&<div style={{marginTop:16}}><div style={{fontSize:10,fontFamily:m,color:"#7c8594",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Licensed Operators</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{det.operators.map((o,i)=><span key={i} style={{background:"#21262d",border:"1px solid #30363d",borderRadius:6,padding:"2px 8px",fontSize:10,fontFamily:m,color:"#c9d1d9"}}>{o}</span>)}</div></div>}
                  <div style={{marginTop:16}}><div style={{fontSize:10,fontFamily:m,color:"#7c8594",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Notes & Restrictions</div><p style={{fontSize:13,color:"#c9d1d9",margin:0,lineHeight:1.6}}>{det.restrictions}</p></div>
                  <div style={{marginTop:16}}><div style={{fontSize:10,fontFamily:m,color:"#7c8594",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Sources</div>{det.sources.map((s,i)=><a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:"block",fontSize:11,color:"#58a6ff",textDecoration:"none",fontFamily:m,marginBottom:3}}>↗ {s.label}</a>)}</div>
                </div>
              ) : <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:12,padding:48,textAlign:"center"}}><div style={{fontSize:13,color:"#7c8594",fontFamily:m}}>Click a state to view details</div></div>}
            </div>
          </div>
        )}

        {view==="table" && (
          <div style={{overflowX:"auto",border:"1px solid #30363d",borderRadius:12}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:m}}>
              <thead><tr style={{background:"#161b22"}}>
                {[{k:"name",l:"State"},{k:"statusLabel",l:"Status"},{k:"channels",l:"Channels"},{k:"taxRate",l:"Tax Rate"},{k:"collegeBetting",l:"College"},{k:"collegeProps",l:"Props"}].map(c=><th key={c.k} onClick={()=>sortH(c.k)} style={{padding:"10px",textAlign:"left",color:"#7c8594",fontSize:10,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",borderBottom:"1px solid #30363d",whiteSpace:"nowrap",userSelect:"none"}}>{c.l}{sc===c.k?(sd==="asc"?" ↑":" ↓"):""}</th>)}
              </tr></thead>
              <tbody>{tbl.map((s,i)=>{
                const isExp = sel === s.abbr;
                return (
                  <React.Fragment key={s.abbr}>
                    <tr onClick={()=>setSel(isExp?null:s.abbr)} style={{background:i%2?"#161b22":"#0d1117",cursor:"pointer",borderBottom:isExp?"none":"1px solid #21262d"}}>
                      <td style={{padding:"7px 10px",fontWeight:600,color:isExp?"#58a6ff":"#f0f6fc"}}>{isExp?"▾ ":"▸ "}{s.name}</td>
                      <td style={{padding:"7px 10px"}}><span style={{background:SC_MAP[s.status]?.fill,color:"#fff",padding:"2px 8px",borderRadius:12,fontSize:9,fontWeight:600,whiteSpace:"nowrap"}}>{s.statusLabel}</span></td>
                      <td style={{padding:"7px 10px",color:"#c9d1d9",fontSize:10}}>{s.channels}</td>
                      <td style={{padding:"7px 10px",color:"#c9d1d9",fontSize:10}}>{s.taxRate}</td>
                      <td style={{padding:"7px 10px",color:"#c9d1d9",fontSize:10}}>{s.collegeBetting}</td>
                      <td style={{padding:"7px 10px",color:"#c9d1d9",fontSize:10}}>{s.collegeProps}</td>
                    </tr>
                    {isExp && (
                      <tr style={{background:"#161b22"}}>
                        <td colSpan={6} style={{padding:"12px 16px 16px",borderBottom:"2px solid #30363d"}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px 20px",fontSize:12,marginBottom:12}}>
                            <F l="Legal Method" v={s.legalMethod}/>
                            <F l="Year Legalized" v={s.yearLegalized||"—"}/>
                            <F l="Year Launched" v={s.yearLaunched||"—"}/>
                            <F l="Tax Rate" v={s.taxRate}/>
                            <F l="Regulator" v={s.regulator}/>
                            <F l="Channels" v={s.channels}/>
                          </div>
                          {s.operators.length>0 && (
                            <div style={{marginBottom:10}}>
                              <div style={{fontSize:9,fontFamily:m,color:"#7c8594",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Licensed Operators</div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{s.operators.map((o,j)=><span key={j} style={{background:"#21262d",border:"1px solid #30363d",borderRadius:6,padding:"2px 8px",fontSize:10,fontFamily:m,color:"#c9d1d9"}}>{o}</span>)}</div>
                            </div>
                          )}
                          <div style={{marginBottom:10}}>
                            <div style={{fontSize:9,fontFamily:m,color:"#7c8594",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Notes & Restrictions</div>
                            <div style={{fontSize:12,color:"#c9d1d9",lineHeight:1.6}}>{s.restrictions}</div>
                          </div>
                          <div>
                            <div style={{fontSize:9,fontFamily:m,color:"#7c8594",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Sources</div>
                            {s.sources.map((src,j)=><a key={j} href={src.url} target="_blank" rel="noopener noreferrer" style={{display:"block",fontSize:11,color:"#58a6ff",textDecoration:"none",fontFamily:m,marginBottom:2}}>↗ {src.label}</a>)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}</tbody>
            </table>
          </div>
        )}

        <div style={{marginTop:28,padding:18,background:"#161b22",border:"1px solid #30363d",borderRadius:12,fontSize:11,color:"#7c8594",fontFamily:m,lineHeight:1.7}}>
          <div style={{fontWeight:600,color:"#c9d1d9",marginBottom:6,fontSize:12}}>Methodology & Sources</div>
          <p style={{margin:"0 0 6px"}}>Data compiled from AGA State of Play map, Tax Foundation (2025), CBS Sports, Legal Sports Report, BMR, SportsHandle, Unabated, BettorsInsider, NCAA (Jan 2026), and Action Network. Cross-referenced April 2026.</p>
          <p style={{margin:"0 0 6px"}}>Tax rates are for online/mobile unless noted. Effective rates may differ due to promo deductions. Operator lists are major licensees, not exhaustive. Missouri college betting rules still being finalized by Gaming Commission.</p>
          <p style={{margin:0}}>Map: U.S. Census Bureau cartographic boundaries via us-atlas, Albers USA projection. For informational purposes only.</p>
        </div>
      </div>
    </div>
  );
}

function F({ l, v }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: "#7c8594", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{l}</div>
      <div style={{ fontSize: 12, color: "#e6edf3", lineHeight: 1.4 }}>{String(v)}</div>
    </div>
  );
}
