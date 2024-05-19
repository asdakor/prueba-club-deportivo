
$(document).ready(function () {
    getData();
});

function getData() {
    $('#cuerpo').html('');
    axios.get('/deportes')
        .then((response) => {
            const deportes = response.data;
            deportes.forEach((d, i) => {
                $('#cuerpo').append(`
                    <tr>
                      <th scope="row">${i + 1}</th>
                      <td>${d.nombre}</td>
                      <td>${d.precio}</td>
                      <td>
                        <button class="btn btn-warning" onclick='preEdit("${d.nombre}", "${d.precio}")' data-toggle="modal" data-target="#exampleModal">Editar</button>
                        <button class="btn btn-danger" onclick='eliminar("${d.nombre}")'>Eliminar</button>
                      </td>
                    </tr>
                `);
            });
        })
        .catch((error) => {
            console.error('Error al obtener los deportes:', error);
        });
}

function preEdit(nombre, precio) {
    $('#nombreModal').val(nombre);
    $('#precioModal').val(precio);
}

function agregar() {
    const nombre = $('#nombre').val();
    const precio = $('#precio').val();
    axios.post(`/agregar`, { nombre, precio })
    .then((response) => {
        alert(response.data.message);
        getData();
    }).catch((error) => {
        console.error('Error al agregar deporte:', error);
    });
    $('#exampleModal').modal('hide');
}

function edit() {
    const nombre = $('#nombreModal').val();
    const precio = $('#precioModal').val();
    axios.get(`/editar`, {
        params: { nombre, precio }
    }).then((response) => {
        alert(response.data.message);
        getData();
    }).catch((error) => {
        console.error('Error al editar deporte:', error);
    });
    $('#exampleModal').modal('hide');
}

function eliminar(nombre) {
    axios.get(`/eliminar`, {
        params: { nombre }
    }).then((response) => {
        alert(response.data.message);
        getData();
    }).catch((error) => {
        console.error('Error al eliminar deporte:', error);
    });
}
