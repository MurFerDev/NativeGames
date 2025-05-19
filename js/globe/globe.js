// Scripts do Globo 3D interativo

const globeContainer = document.querySelector('#globeViz');
const world = Globe()(globeContainer)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .htmlElementsData([
        {
            lat: -10.3333,
            lng: -53.2,
            name: 'Adugo (Brasil)',
            link: 'jogos/adugo.html'
        },
        {
            lat: 35.8617,
            lng: 104.1954,
            name: 'Dou Shou Qi (China)',
            link: 'jogos/doushouqi.html'
        },
        {
            lat: 26.8206,
            lng: 30.8025,
            name: 'Senet (Egito)',
            link: 'jogos/senet.html'
        },
        {
            lat: 33.2232,
            lng: 43.6793,
            name: 'Jogo Real de Ur (Mesopotâmia)',
            link: 'jogos/jogodeur.html'
        },
        {
            lat: 28.2350,
            lng: 84.0732,
            name: 'Bagha Chall (Nepal)',
            link: 'jogos/baghachall.html'
        },
        {
            lat: -1.2921,
            lng: 36.8219,
            name: 'Mancala (África)',
            link: 'jogos/mancala.html'
        }
    ])
    .htmlElement(d => {
        const el = document.createElement('div');
        el.className = 'marker-label';
        el.innerHTML = d.name;
        el.style.cursor = 'pointer';
        el.onclick = () => window.location.href = d.link;
        return el;
    });