import express from 'express'; 

class Alumno {
    constructor(cuenta, nombre) {
        this.cuenta = cuenta;
        this.nombre = nombre;
    }
}

class Grupo {
    constructor(nombre) {
        this.nombre = nombre;
        this.grupoArray = [];
    }
    insertar(alumno) {
        this.grupoArray.push(alumno);
    }
}

let alumn1 = new Alumno(20246525, "juan");
let alumn2 = new Alumno(20246523, "roman");
let alumn3 = new Alumno(20246521, "cosme fulanito");

let grp = new Grupo("grupo4i");
grp.insertar(alumn1);
grp.insertar(alumn2);
grp.insertar(alumn3);

console.log(grp.grupoArray);

const app = express();


app.get('/alumnos', (req, res) => {
    res.json(grp.grupoArray);
});

app.get('/alumnos/:id', (req, res) => {
    let id = req.params.id;
    let cuentaEncontrada = grp.grupoArray.find(alumno => alumno.cuenta === parseInt(id));
    
    if (cuentaEncontrada) {
        res.json(cuentaEncontrada);
    } else {
        res.status(404).json({ error: "alumno no encontrado" });
    }
});

app.delete('/alumnos/:id', (req, res) => {
    let id = req.params.id;
    let pos = grp.grupoArray.findIndex(alumno => alumno.cuenta === parseInt(id));
    
    if (pos >= 0) {
        grp.grupoArray.splice(pos, 1);
        res.status(202).json({ eliminado: `se elimino la cuenta: ${id}` });
    } else {
        res.status(404).json({ error: "alumno no encontrado" });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});