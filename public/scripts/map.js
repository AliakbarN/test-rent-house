function calculateCenter (coords) {
    let xSum = 0;
    let ySum = 0;

    coords.forEach( coord => {
        xSum += coord[0];
        ySum += coord[1];
    })

    return [xSum / coords.length, ySum / coords.length];
}

function createMap (coords = [], price) {
    const map = new mapgl.Map('map', {
        key: 'e62af28a-06e5-4f45-a93b-0293cd9963c5',
        center: calculateCenter(coords),
        zoom: 16,
    });
    coords.forEach( (coord, index) => {
        const marker = new mapgl.Marker(map, {
            coordinates: coord,
            icon: '/stylesheets/icons/location-pin.png',
            label: {
                text: `${price[index]}$`
            }
        });
    })
}

export { createMap };