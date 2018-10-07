const gitrouter = require('express').Router();

const accesstoken = null;
//GITHUB oauth
var githubOAuth = require('github-oauth')({
  githubClient: "5accb37309b32f81497c",
  githubSecret: "e747ca9b096b54b968b768bad18f6597e936359a",
  baseURL: 'http://localhost:4000',
  loginURI: '/auth/github',
  callbackURI: '/auth/github/callback'
  })
  
  gitrouter.get("/auth/github", function(result,req, res){
  console.log("started oauth");
  return githubOAuth.login(req, res);
  });

  gitrouter.get("/auth/home", function(req, res){
    console.log("oauth redirect");
    return res.status(200).send({
      message: "Username " + res.token
  });
    });
  
    gitrouter.get("/auth/github/callback", function(req, res){
  //console.log("received callback" +result.json);
  //console.log("username"+res.githubSecret.userName);
  var serverResponse= githubOAuth.callback(req, res);
  console.log(res.message)
  accessToken = serverResponse.access_token;
  console.log(" access token ::" +accessToken);
  });
  
  githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
  })
  
  githubOAuth.on('token', function(token, serverResponse) {
  serverResponse.end(JSON.stringify(token))
  })

  gitrouter.get("/auth/user", (req, res,next)=>{
    console.log("get user details");
  
   //console.log("username"+res.githubSecret.userName);
    request
    .get('https://api.github.com/user')
   .set('Authorization','token'+accesstoken)
    .then(function(result) {
      res.send(result.body);
    });
    });

    module.exports = git-router ;