const inquirer = require('inquirer');
require('colors');

// Esqueleto de la creacion de un SELECT  para consola
const questionOption = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            { value: 1 , name: `${'1'.green}. Buscar Ciudad` },
            { value: 2 , name: `${'2'.green}. Historias` },
            { value: 0 , name: `${'0'.green}. Salir` },
        ]
    }

];


// Toma el esquelo de la lista y la genera
const inquirerMenu = async () => {
    console.clear();

    console.log('========================'.green);
    console.log(' Seleccione Una opción '.green);
    console.log('========================\n'.green);
    const { opcion } = await inquirer.prompt(questionOption);

    // Retorno el value que representa los options de mi select
    return opcion;

}


// Pausar la ejecucion de la aplicacion hasta que el usuario de enter
const pausa = async () => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }];

    
    console.log('\n');
    await inquirer.prompt(question);
}


// Obtener datos escritos por consola 
const leerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingresa un valor'.red;
                }
                return true;
            }
        }
    ]


    const { desc } = await inquirer.prompt(question);
    return desc;
}

// Genera un lista dinamica
const listarLugares = async (lugares = []) => {

    
    const choices = lugares.map((lugar , i) => {
        const idx = `${i + 1}`.green;
        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}`
        }
    })

    
    
    
    choices.unshift({ value: 0, name: '0.'.green + 'Cancelar' });
    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Selecciones Una Ciudad',
            choices
        }
    ];
    const { id } = await inquirer.prompt(questions);

    
    return id;
}


// Confirmacion de una accion por consola
const confirmar = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message

        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;



}

// Genera un checkbox
const mostarListadoCheckList = async (tareas = []) => {

    // Mostramos las tareas 
    const choices = tareas.map(({ id, description, completed }, i) => {

        const idx = `${i + 1}`.green;
        return {
            value: id,
            name: `${idx}. ${description}`,
            checked: (completed) ? true : false
        }
    })


    // Creamos el cascaron la interfaz
    const message = 'Seleccione con la tecla espacio las tareas que desea completar'.blue
    const questions = [{ type: 'checkbox', name: 'ids', message, choices }];

    // mostramos la interfaz en consola
    const { ids } = await inquirer.prompt(questions);
    return ids;
}

module.exports = {
    listarLugares,
    mostarListadoCheckList,
    inquirerMenu,
    leerInput,
    confirmar,
    pausa
}
