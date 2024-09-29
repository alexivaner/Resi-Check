// providers.js

export const shopeeRegexes = {
    "SPX Standard": /^SPXID\d+$/,
    "Pos Reguler": /^SHPE\d{11}$/,
    "ID Express": /^IDS\d{12}$/,
    "J&T Express": /^JP\d{10}$/,
    "JNE Regular": /^CM\d{11}$/,
    "JNE Trucking (JTR)": /^JT\d{11}$/,
    "J&T Cargo": /^\d{12}$/,
};

export const tokopediaRegexes = {
    "JNE Regular": /^TLJR/,  // Matches TLJR followed by alphanumeric characters
};
