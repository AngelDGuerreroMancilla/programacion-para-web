import express from 'express'

const app = express();
app.use(express.json());
app.use(express.static('.'));


const arrayCarros = [];

class Carro {
    constructor(placa, marca, modelo) {
        this.placa = placa;
        this.marca = marca;
        this.modelo = modelo;
    }
}


app.get('/vehiculos', (req, res) => {
    res.json(arrayCarros);
});

app.get('/vehiculos/:id', (req, res) => {
    const id = req.params.id;
    const carroId = arrayCarros.find(carro =>carro.placa ===id)
    if(carroId){
        res.json(carroId);
    } else {
        res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }
});


app.post('/vehiculos', (req, res) => {
    const { placa, marca, modelo } = req.body

    const carro = new Carro(placa, marca, modelo) 


    arrayCarros.push(carro);

    res.status(201).json({
        mensaje: 'carro creado exitosamente',
        data: carro
    })
})

app.delete('/vehiculos/:id',(req,res)=>{
    const id = req.params.id;
    const indice= arrayCarros.findIndex(carro => carro.placa === id);
    if(indice !== -1){
        arrayCarros.splice(indice,1)
        res.status(200).json({
            mensaje:`carro con placa ${id} eliminado`  
        })
        
    }
    else{
        res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})