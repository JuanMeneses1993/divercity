import { Router } from "express";

const router = Router();

router.get("/", (req, res)=>{
    
    res.render('pages/panel', {
        buttons: `../partials/${String(req.session.role)}-buttons`,
        controls: `../partials/${String(req.session.role)}-controls`, 
        footer: `../partials/${String(req.session.role)}-footer`, 
        info : {user: req.session.user}
    });
    
});



export default router;