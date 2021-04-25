exports.MESSAGES = {
  RANKING: {
    NO_INFO: "Edetabeli informatsioon puudub",
    DOES_NOT_EXIST: "Edetabeli kirjeid ei leitud",
    ERROR_SAVING: "Viga esines salvestamisel",
    SUCCESS_LEAVE: "Sa oled edukalt lahkunud edetabelist",
    CANNOT_LEAVE: "Sa ei saa lahkuda edetabelist, kuhu Sa ei kuulu",
    SUCCESS_JOIN: "Sa oled edukalt liitunud edetabeliga",
    CANNOT_JOIN: "Sa juba oled liitunud antud edetabeliga",
  },
  CHALLENGE: {
    DOES_NOT_EXIST: "Väljakutset ei eksisteeri",
    MUST_ENTER_PLACE_TIME: "Peab sisestama koha ja kuupäeva",
    DATETIME_LESS_THAN_48H: "Väljakutset ei saa esitada vähema kui 48 tunni sees",
    CANNOT_CHALLENGE_SELF: "Iseendale ei saa väljakutset esitada",
    CANNOT_UPDATE_CHALLENGE_SELF: "Ei saa uuendada väljakutset, milles Sa ise ei osale",
    CANNOT_DELETE_CHALLENGE_SELF: "Ei saa kustutada väljakutset, milles Sa ise ei osale",
    BOTH_MUST_BE_JOINED: "Mõlemad kasutajad peavad olema liitunud edetabeliga",
    NOT_FOUND: "Väljakutset ei leitud",
    CANNOT_DELETE_24H: "Ei saa kustutada väljakutset, mis toimub vähema kui 24 tunni pärast",
    CANNOT_DELETE_RESULT: "Ei saa kustutada väljakutset, millel on esitatud tulemus",
    ERROR_DELETING: "Väljakutse kustutamine ebaõnnestus",
    MUST_BE_PARTICIPANT: "Pead olema üks osalejatest väljakutses selleks, et aktsepteerida",
    CANNOT_ACCEPT: "Ei saa aktsepteerida väljakutset, mida pole esitatud Sulle",
    ALREADY_ACCEPTED: "Väljakutse on juba aktsepteeritud",
    CANNOT_UPDATE_FUTURE_CHALLENGE: "Ei saa sisestada tulemust väljakutsele, mis toimub tulevikus",
  },
  USER: {
    NO_INFO: "Kasutaja andmed puuduvad",
    DOES_NOT_EXIST: "Sellist kasutajat ei leitud",
    EMAIL_ALREADY_EXISTS: "Sellise e-mailiga kasutaja juba eksisteerib",
    ERROR_SAVING: "Esines viga kasutaja salvestamisel",
    ERROR_HASING: "Esines viga parooli räsiga",
    ERROR_BCRYPT: "Esines viga parooli soolamisega",
    ENTER_ALL_FIELDS: "Palun sisesta kõik väljad",
    INVALID_FIELD_VALUES: "Palun täida väljad korrektselt",
    ERROR_SIGNING_JWT: "Viga tähise kirjastamisel",
    INVALID_CREDENTIALS: "Vale e-mail või parool",
    PLEASE_CONFIRM_EMAIL: "Palun kinnita enda e-posti aadress",
    CREATED_SUCCESSFULLY: "Kasutaja loodud edukalt",
    INCORRECT_TOKEN: "Ebakorrektne kinnituskood",
    ALREADY_ACTIVATED: "Kasutaja konto on juba aktiviseeritud",
    CONFIRMED_SUCCESSFULLY: "Kasutaja kinnitatud edukalt, saate nüüd sisse logida"
  },
  NOTIFICATION: {
    DOES_NOT_EXIST: "Sellist teadet ei leitud",
    DO_NOT_EXIST: "Teateid ei leitud"
  }
}