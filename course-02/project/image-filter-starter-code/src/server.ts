import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';




(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/filteredimage", async ( req, res ) => {
    
    //get image_url from Query
    let{image_url} = req.query;
    
    
    const util = require('util');
    const urlExists = util.promisify(require('url-exists'));

    //validate the input image URL is a working URL
    let isWorkingURL = await urlExists(image_url); 
    
    //if non working URL then send error message 
    if(!isWorkingURL)
      res.send("Invalid image url, Please re-try with valid image URL !");
  

      try
      {
      // filter image file 
      let imageFile = await filterImageFromURL(image_url);
      
      //call clean up after finish sending response , passing the function to be executed on finish event, 
      // it will be called automatically after finish sending response
      res.on("finish",function()
      {
        deleteLocalFiles([imageFile]);
      });

      //send image file
      res.sendfile(imageFile);
      }
      catch(err)
      {
        res.send("Image not available !" ) ;
      }
      
 
  } );
  
 
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();