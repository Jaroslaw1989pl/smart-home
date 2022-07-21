exports.hideEmail = (email) => {

  const emailArray = email.split("@");
  
  let name = emailArray[0];
  let name1 = name.substring(0, name.length / 2);
  let name2 = name.substring(name.length / 2);
  name = name1 + name2.replace(/\w/g, "*");;
  
  let server = emailArray[1].split(".");
  server.pop();
  server = server.join('.');
  server = server.replace(/\w/g, "*");
  
  let domain = emailArray[1].split(".");
  domain = domain[domain.length - 1];
  
  return name + '@' + server + '.' + domain;
};