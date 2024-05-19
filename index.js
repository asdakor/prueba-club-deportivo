import express from 'express';
import { engine } from 'express-handlebars';
import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';
import path from 'path';

//__DIRNAME PARA ES6
const __dirname = import.meta.dirname;

const pathFile = __dirname + "/data/deportes.json"
//INICIAR EXPRESS
const app = express()

//USAR PUBLIC COMO ARCHIVO ESTATICO
app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist' )))

//MIDELWARES BODY
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//HANDLEBARS CONFIG
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'./views'));




app.get('/', (req, res) => {
    res.render('home');
});

app.get('/deportes', async (req, res) => {
    try{
       const stringDeportes = await readFile(pathFile, 'utf8')
       const deportes = JSON.parse(stringDeportes)
       return res.json(deportes)
    } catch(e) {
        console.log(e)
        return res.status(500).json({ok:false})
    }
});
//RUTAS
// Agregar deporte
app.post('/agregar', async (req, res) => {
    const nombre = req.body.nombre
    const precio = req.body.precio
    const newDeporte = {
        nombre: nombre,
        precio: precio
    }
    const stringDeportes = await readFile(pathFile, 'utf8')
    const deportes = JSON.parse(stringDeportes)
    deportes.push(newDeporte)
    await writeFile(pathFile, JSON.stringify(deportes))
    res.json({ message: 'Deporte agregado exitosamente' });
});

// Editar deporte
app.get('/editar', async (req, res) => {
    
    res.json({ message: 'Deporte editado exitosamente' });
});

// Eliminar deporte
app.delete('/eliminar', async (req, res) => {
    const nombre = req.query.nombre;
    const stringDeportes = await readFile(pathFile, 'utf8');
    const deportes = JSON.parse(stringDeportes);
    const deporte = deportes.find((item) => item.nombre === nombre);
    console.log(nombre)
    if (!deporte) {
        return res.status(404).json({ ok: false, msg: "Deporte no encontrado" });
    }
    const newDeportes = deportes.filter((item) => item.nombre !== nombre);
    await writeFile(pathFile, JSON.stringify(newDeportes));
    res.json({ message: 'Deporte eliminado exitosamente' });
});
//CONFIGURACION PAGINAS NO RUTEADAS MSJ ERROR (SIEMPRE AL FINAL)
app.get("/*", (req, res) => {
    res.send("404 Error not found")
})

//CONFIGURACION DE PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor se inicio en http://localhost:${PORT}`)
})