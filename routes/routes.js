var appRouter = function (app) {
    app.get("/validate", function(req, res) {
      res.status(200).send("Welcome to our restful API");
    }),
    app.get("/validate1", function(req, res) {
        res.status(200).send("Welcome to our restful API1");
      }),
      app.post('/loginandlog', function(req, res) {
        var username = req.body.username;
        var  password = req.body.password;
        if(username == password) {
        res.status(200).send("Successfully validated");
      }
      else {
        res.status(403).json(" Invalid error code");
      }
    
      }),
      app.get('/:userID/contacts', (req, res) => {
        res.json(
         
          [
                {
                    id: req.params.userID,
                    title: "Alison"
                   
                },
                {
                    id: 2,
                    title: "Einstein"
                }
            ])
    });
      

      
  }
  
  module.exports = appRouter;