/**
 * All user-facing strings.
 *
 * MUSIC: confirmed by the client 2026-08-04 as 80s/90s rock — Guns N' Roses,
 * Metallica and similar. Published sources (Time Out, local press) describe
 * "classic rock and blues, Led Zeppelin and Hendrix"; those descriptions are
 * dated and have been dropped rather than hedged against. The client's account
 * wins — they know the room.
 */

export const copy = {
  nav: {
    home: 'Home',
    menu: 'Menu',
    story: 'Story',
    findUs: 'Find us',
    skipToContent: 'Skip to content',
  },

  common: {
    call: 'Call the bar',
    callShort: 'Call',
    directions: 'Get directions',
    directionsShort: 'Directions',
    quickActions: 'Call or get directions',
    comeIn: 'Come in tonight',
    viewMenu: 'See the menu',
    readStory: 'Read the story',
    openNow: 'Open now',
    closedNow: 'Closed',
    opensAt: (t) => `Opens ${t}`,
    opensDayAt: (d, t) => `Opens ${d} at ${t}`,
    untilClose: (t) => `until ${t}`,
    everyDay: 'Every day',
    closedLabel: 'Closed',
    hoursHeading: 'Hours',
    hoursMayExtend:
      'Hours can run later than listed — Andre has been known to keep it open. Call ahead if it matters.',
    backHome: 'Back to the bar',
  },

  home: {
    title: "Captain's Cabin",
    tagline: 'Sixty years of people passing through Hamra — and leaving something behind.',
    intro:
      "It started with airline crews and it never really stopped. Sailors, pilots, students, journalists, people in Beirut for a week and people who never left — they came in, drank, talked, and signed the wall. The flags overhead were left by them. Cold beer, tall drinks, a pool table, a dartboard, foosball, a table outside, and whatever Andre feels like playing.",
    established: 'Est. 1964 · Hamra, Beirut',
    ratingLine: (rating, count) => `${rating} stars from ${count} Google reviews`,

    /** The closing invitation — the emotional payoff of the whole page. */
    inviteEyebrow: 'One more thing',
    inviteHeading: 'There is space on the wall',
    inviteBody:
      'Everyone whose name is up there was a stranger walking in for the first time, exactly once. Come in, have a drink, stay long enough to be worth remembering, and put your name somewhere near theirs.',
    inviteAction: 'Come find us',

    /** The repositioning lives here: the room is the point, the people are the story. */
    worldHeading: 'A room full of people’s stories',
    worldBody:
      "Every flag on the ceiling and every name on the wall belongs to someone who sat where you're sitting. Sixty years of them, from more countries than anyone has bothered to count. Nobody curated this and nobody is charging you to look at it — it accumulated, one night at a time, because people kept turning up and wanting to be remembered here.",
    worldSecond:
      "Come on your own and you will end up talking to somebody. That is not a promise the bar makes; it is just what the room does.",

    /**
     * The room itself. This is where the "cosy bar in Hamra" intent gets
     * answered — in a paragraph that reads like a description rather than a
     * keyword. British spelling ("cosy") is used site-wide; Google treats it and
     * "cozy" as the same word, and mixing the two would just look sloppy.
     */
    roomHeading: 'Dark and cosy',
    roomBody:
      "Low ceilings, wood on every wall, lit like a back porch at midnight. There is no dance floor and nobody is shouting over a DJ — the noise level is the kind where you can actually hear the person opposite you. It is the quiet end of Hamra nightlife, and it has been for sixty years.",

    featuresHeading: "What's inside",
    features: [
      {
        title: 'Pool',
        body: 'The table at the back leans just enough to help you win. The cues are older than most of the customers.',
      },
      {
        title: 'Darts',
        body: "A board that's been in use for decades, and a scoreboard on the wall.",
      },
      {
        title: 'The walls',
        body: 'Signed, drawn on and written over by sixty years of drinkers from everywhere. Add yours — that is what they are for.',
      },
      {
        title: 'The flags',
        body: 'Left behind by people who wanted their country in the room. Nobody has counted them.',
      },
      {
        title: 'Outside',
        body: 'An outdoor area for when the room gets warm, or you want a cigarette and a quieter conversation.',
      },
      {
        title: 'Foosball',
        body: 'For when the pool table is taken. Two a side settles an argument faster than talking does.',
      },
    ],

    /**
     * Events — confirmed by the client 2026-10-11: birthdays, private events,
     * barbecues on request, catering. Nothing here about capacity, minimum
     * spend or pricing; none of that is confirmed, so the answer is "call".
     */
    eventsEyebrow: 'Bring people',
    eventsHeading: 'Birthdays and private nights',
    eventsBody:
      "The room has seen sixty years of other people's celebrations. It can take yours. Birthdays, leaving drinks, a night with the place to yourselves — ring the bar and talk it through with Andre.",
    eventsFood: 'Food is on request: a barbecue outside, or catering for the whole party.',
    eventsList: ['Birthdays', 'Private events', 'Barbecues on request', 'Catering'],
    eventsAction: 'Call to plan it',

    musicHeading: 'Rock, and nothing but',
    musicBody:
      "Eighties and nineties rock, played properly loud. Guns N' Roses, Metallica, and the rest of that bunch. Andre runs it himself from behind the bar and has done for decades — no DJ, no playlist, no algorithm deciding what a Tuesday sounds like. If you came for a curated cocktail programme you're in the wrong place. If you came because somebody put the right song on at the right time, you're in the right one.",

    menuTeaserHeading: 'Beer, spirits, long drinks',
    menuTeaserBody:
      "This is a beer-and-long-drinks bar and it doesn't pretend otherwise. Poured tall, priced fairly.",

    storyTeaserHeading: 'Open since 1964',
    storyTeaserBody:
      'Three Middle East Airlines pilots rented an old fish shop in Hamra and lined it with wood. It has been open ever since — through the war, through everything, to everyone.',

    findHeading: 'Where to find us',
    findBody: 'Adonis Street, off Hamra Street, in Hamra, Ras Beirut.',
  },

  /**
   * Answers to what people actually type. These are written as real answers —
   * they carry the "best bar in Hamra", "cosy bar in Hamra", "late night",
   * "pool", "outdoor seating" intent without a keyword block anywhere.
   *
   * Also emitted as FAQPage structured data, which is what can win the
   * expandable results under the listing.
   *
   * ⚠ Every answer here must stay true. Nothing about prices, food or bookings
   *   may be tightened up beyond what the client has actually confirmed.
   */
  faq: {
    heading: 'Questions people ask',
    items: [
      {
        q: 'Where exactly is Captain’s Cabin?',
        a: 'On Adonis Street in Hamra, Ras Beirut, a couple of minutes on foot off Hamra Street. The frontage is small and easy to walk past — use the map link or the Plus Code on the Find us page and it will put you on the door.',
      },
      {
        q: 'What time does it open and close?',
        a: 'Six in the evening, every night. Sunday runs until half past midnight and the rest of the week until three in the morning — later if the night is going well, which it often is.',
      },
      {
        q: 'Is it a quiet, cosy bar or a loud one?',
        a: 'Quiet, dark and cosy. Wood-panelled walls, low lighting, no DJ and no dance floor, so you can hold a conversation without raising your voice. People come here to talk and stay for hours, which is the whole point of the place.',
      },
      {
        q: 'What makes it worth going to over the other bars in Hamra?',
        a: 'It has been open since 1964 and barely changed. The walls are covered in the names and flags of sixty years of drinkers from all over the world, there is a pool table and a dartboard at the back, and the owner picks the music himself. It is the least trend-driven bar in the neighbourhood.',
      },
      {
        q: 'Is it the oldest bar in Beirut?',
        a: 'It is one of the oldest bars in Beirut still open. Captain’s Cabin has been in Hamra since 1964, licensed as a bar since 1972, and it is one of the few in the city that kept opening right through the civil war. The room has barely changed in that time — the walls just filled up.',
      },
      {
        q: 'Is there a pool table, darts, foosball?',
        a: 'All three. The pool table and the dartboard are at the back of the room; the table leans just enough to help you win, and the cues have seen decades of service. There is a foosball table too. Nobody is precious about any of them.',
      },
      {
        q: 'Is there outdoor seating?',
        a: 'Yes — there is an outdoor area, which is where most people end up when the room warms up or they want a cigarette.',
      },
      {
        q: 'Do I need to book a table?',
        a: 'No — walk in. If you are bringing a large group it is worth ringing ahead so they know you are coming.',
      },
      {
        q: 'Can I hold a birthday or a private event there?',
        a: 'Yes. The bar does birthdays and private events — call and arrange it with Andre. A barbecue or catering can be laid on if you ask.',
      },
      {
        q: 'What kind of music do you play?',
        a: 'Eighties and nineties rock — Guns N’ Roses, Metallica, that whole bunch. Andre picks it himself from behind the bar. There is no DJ and no playlist, so it is chosen on the night by a person rather than queued up by an algorithm.',
      },
    ],
  },

  menu: {
    title: 'Menu',
    metaTitle: "Menu — Captain's Cabin, Hamra",
    intro: 'Beer, spirits and long drinks. No cocktail list — ask for what you want and it gets poured.',
    pricesPending:
      'Prices are being confirmed with the bar and will appear here shortly. Call for anything you need to know now.',
    priceNote: 'Prices can change. Call ahead if it matters.',
    askAtBar: 'Ask at the bar',
    sectionsHeading: 'Drinks',
  },

  story: {
    title: 'The story',
    metaTitle: 'Our story — one of the oldest bars in Beirut, open since 1964',
    lede:
      "Captain's Cabin has been open in Hamra since 1964, which makes it one of the oldest bars in Beirut. In that time a very large number of people, from a very large number of places, have sat in the same few chairs — and most of them left their name on the wall on the way out.",

    sections: [
      {
        heading: 'A fish shop and three pilots',
        body:
          "In 1964, three Middle East Airlines pilots and the father of the current owner rented an old fish shop a few metres off Hamra Street. They panelled over the yellow tiles in wood and made it their own — somewhere to land between flights. Word travelled through the airline, more crew started spending layovers there, and the room kept growing. By 1972 it was a fully licensed bar.",
      },
      {
        heading: 'It never closed',
        body:
          "Captain's Cabin is one of the few bars in Beirut that stayed open through the civil war. Not as a statement — it simply kept opening. That is the thing regulars mention first, and it is why the place carries the weight it does in Hamra.",
      },
      {
        heading: 'Andre',
        body:
          'The bar has been run by Andre for decades. He pours, he picks the music, and he decides when the night is over. Ask him about the room and he will tell you about it; the stories are better first-hand than they are on a website.',
      },
      {
        heading: 'The walls, and the flags',
        body:
          'Every surface is covered. Names, dates, drawings, messages from people who came through once in 1988 and people who were here last week — and above them, the flags left behind by drinkers from just about everywhere. It is the closest thing Beirut has to a guest book, and it is still being written.',
      },
      {
        heading: 'Everyone ends up here',
        body:
          'The crews stopped coming when the airline schedules changed, but the room never went local-only. Students from the university down the road, journalists who came for a fortnight in 1982, sailors off ships in the port, people who moved to Beirut and people who were leaving it. The bar has no door policy and never has, which turns out to be the whole trick: sit down for long enough and the person next to you is from somewhere you have never been, with a reason for being here that you would not have guessed.',
      },
    ],

    factsHeading: 'The short version',
    facts: [
      { label: 'Opened', value: '1964' },
      { label: 'Licensed as a bar', value: '1972' },
      { label: 'Neighbourhood', value: 'Hamra, Ras Beirut' },
      { label: 'Type', value: 'Dive bar' },
    ],
  },

  findUs: {
    title: 'Find us',
    metaTitle: "Find us — Captain's Cabin, Hamra, Beirut",
    intro:
      "We're on Adonis Street in Hamra, Ras Beirut, a couple of minutes off Hamra Street. It is a small frontage and it is easy to walk past — look for the wooden door.",
    addressHeading: 'Address',
    plusCodeLabel: 'Google Plus Code',
    plusCodeHelp: 'Paste this into Google Maps to land on the door.',
    mapHeading: 'On the map',
    mapTitle: "Google map showing the location of Captain's Cabin in Hamra, Beirut",
    mapCaption: 'Pan and zoom, or open it in Google Maps for turn-by-turn.',
    phoneHeading: 'Phone',
    gettingHereHeading: 'Getting here',
    gettingHere: [
      'Walking from Hamra Street takes a couple of minutes.',
      'Any taxi or ride-hail driver will know Hamra; give them the phone number if they need the exact door.',
      'Street parking in Hamra is limited after dark — walking or a taxi is easier.',
    ],
    addressPendingNote:
      'The exact street name is being confirmed with the bar. Use the map link or the Plus Code below in the meantime.',
  },

  footer: {
    rights: (year) => `© ${year} Captain's Cabin, Hamra, Beirut.`,
    findHeading: 'Find us',
    pagesHeading: 'Pages',
    googleListing: 'Google listing',
    leaveReview: 'Leave a review',
    creditPrefix: 'Developed by',
    creditName: 'tramanocreative.com',
    creditUrl: 'https://tramanocreative.com',
    photoCredit: 'Photographs by visitors to the bar.',
  },

  notFound: {
    title: 'Nothing here',
    body: 'That page does not exist. The bar, however, does.',
  },

  meta: {
    // Titles keep "bar", "Hamra", "Beirut" and 1964 — those are the queries — while
    // the descriptions carry the positioning.
    homeTitle: "Captain's Cabin — bar in Hamra, Beirut since 1964",
    homeDescription:
      "One of the oldest bars in Beirut: the Hamra rock bar where sixty years of visitors have left their names on the wall and their flags on the ceiling. 80s and 90s rock, cold beer, pool, darts, foosball and outdoor seating. Birthdays and private events. Open since 1964.",
    menuDescription:
      "Beer, spirits and long drinks at Captain's Cabin in Hamra, Beirut. No cocktail list, fair prices, poured tall.",
    storyDescription:
      'One of the oldest bars in Beirut. Opened in 1964 by Middle East Airlines pilots in a converted fish shop. It stayed open through the civil war, and its walls are signed by visitors from all over the world.',
    findUsDescription:
      "How to find Captain's Cabin in Hamra, Ras Beirut — address, Plus Code, phone number and directions.",
  },
}

/** Kept as a function so call sites read the same as before the locale removal. */
export function t() {
  return copy
}
