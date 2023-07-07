const turtle = (mainHeight) => {
    let day = 0;
    let night = 0;
    let totalHeight = 0;

    const dayGo = () => {
        day++;
        totalHeight += 50;
    };

    const nightGo = () => {
        night++;
        totalHeight -= 30;
    };

    do {
        if (totalHeight < mainHeight) dayGo();
        if (totalHeight < mainHeight) nightGo();
    } while (totalHeight < mainHeight);


    return day;
};

const handshake = (people) => {
    return (people * (people - 1)) / 2;
};

const unique = (string) => {
    return Array.from(new Set(string.split(','))).join(',');
};

console.log('Задача 1', turtle(100));
console.log('Задача 2', handshake(10))
console.log('Задача 3', unique('кошка,собака,лошадь,корова,кошка'));