/* Synthetic demo records. Not real people. Not a verification source. */
(function () {
  var P = [
    ["Maya","Okafor","MD","Cardiovascular Disease","1988-04-17","TX",["1999999018","1999999208"],["SYN-TX-55120"],"2014-03-10","2028-03-31","2020-09-01","2030-12-31","ZO1000018","2028-04-30"],
    ["Rafael","Montoya","MD","Hospitalist (Internal Medicine)","1985-09-02","MD",["1999999026"],[],"2013-07-22","2027-09-30","2019-02-01","2029-12-31","ZM1000026","2027-10-31"],
    ["Daniel","Reyes","DO","Emergency Medicine","1986-01-23","OK",["1999999034","1999999216"],[],"2014-08-05","2028-01-31","2019-11-15","2029-12-31","ZR1000034","2028-02-28"],
    ["Priya","Raman","MD","Obstetrics & Gynecology","1984-06-30","IN",["1999999042","1999999224"],[],"2012-06-18","2027-06-30","2018-10-01","2028-12-31","ZR1000042","2027-07-31"],
    ["Elena","Vasquez","MD","Pediatrics","1983-11-11","FL",["1999999059","1999999257"],[],"2011-09-14","2026-06-30","2017-01-20","2027-12-31","ZV1000059","2027-11-30"],
    ["Hannah","Kowalski","DO","Family Medicine","1990-02-14","IL",["1999999067","1999999281"],[],"2016-07-12","2028-07-31","2019-09-10","2029-12-31","ZK1000067","2028-08-31"],
    ["Sarah","Lindqvist","APRN-CNP","Family Nurse Practitioner","1987-08-08","WI",["1999999075","1999999232"],[],"2013-05-06","2027-05-31","2014-02-01","2029-12-31","ZL1000075","2027-06-30"],
    ["James","Whitfield","MD","Orthopaedic Surgery","1980-03-19","TN",["1999999083","1999999240"],["SYN-TN-40817"],"2012-08-27","2028-08-31","2018-07-15","2028-12-31","ZW1000083","2028-09-30"],
    ["Thomas","Nguyen","MD","Anesthesiology","1986-12-05","IL",["1999999091","1999999265"],[],"2015-06-30","2027-12-31","2020-03-05","2030-12-31","ZN1000091","2028-01-31"],
    ["Aisha","Bello","MD","Hospitalist (Internal Medicine)","1985-05-21","MD",["1999999109","1999999273"],[],"2014-09-09","2027-09-30","2019-04-12","2029-12-31","ZB1000109","2027-10-31"],
    ["Noah","Brennan","MD","Psychiatry","1987-10-29","TX",["1999999117"],[],"2016-04-19","2028-04-30","2021-06-01","2031-12-31","ZB1000117","2028-05-31"]
  ];
  var ENUM = {"1999999018":"2012-05-14","1999999208":"2016-08-02","1999999026":"2011-03-09","1999999034":"2012-02-21","1999999216":"2015-10-12","1999999042":"2010-09-30","1999999224":"2014-07-01","1999999059":"2010-06-17","1999999257":"2013-04-25","1999999067":"2014-06-03","1999999281":"2016-01-19","1999999075":"2011-12-12","1999999232":"2015-03-30","1999999083":"2010-11-08","1999999240":"2013-09-17","1999999091":"2013-05-28","1999999265":"2016-02-11","1999999109":"2012-10-04","1999999273":"2014-12-15","1999999117":"2014-03-27"};
  var people = P.map(function (r) {
    var o = { first:r[0], last:r[1], degree:r[2], specialty:r[3], dob:r[4], licenseState:r[5], npis:r[6], licenseNumbers:[],
      licIssued:r[8], licExpires:r[9], boardInitial:r[10], boardExpires:r[11], dea:r[12], deaExpires:r[13],
      licStatus:"Active", licName:null, licDob:null, discipline:"None", reports:[], enumerated:ENUM };
    o.npis.forEach(function (n) { o.licenseNumbers.push("SYN-" + o.licenseState + "-" + n.slice(-5)); });
    r[7].forEach(function (x) { if (o.licenseNumbers.indexOf(x) < 0) o.licenseNumbers.push(x); });
    o.licenseType = o.degree === "DO" ? "Osteopathic Physician (DO)" : o.degree === "APRN-CNP" ? "Advanced Practice Registered Nurse" : "Physician and Surgeon (MD)";
    o.boardSpecialty = o.specialty;
    return o;
  });
  function by(last) { return people.filter(function (p) { return p.last === last; })[0]; }
  var v = by("Vasquez"); v.licStatus = "Expired";
  var w = by("Whitfield"); w.licName = "James R. Whitfield"; w.licDob = "1980-09-13"; w.boardInitial = "2018-07-15";
  var r = by("Reyes");
  r.reports = [{ type:"Medical malpractice payment", eventDate:"2022-03-14", payment:"USD 185,000", allegation:"Emergency department — delayed diagnosis (synthetic)", entity:"Example Locum Staffing Insurer (synthetic)" }];
  window.PEOPLE = people;
})();
