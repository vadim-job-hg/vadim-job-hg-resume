import 'babel-polyfill';
import picoModal from 'picomodal';
import extractTracks from './track';
import Image from './image';
import * as files from '../files/files.json';
const AVAILABLE_THEMES = [
    'CartoDB.DarkMatter',
    'CartoDB.DarkMatterNoLabels',
    'CartoDB.Positron',
    'CartoDB.PositronNoLabels',
    'Esri.WorldImagery',
    'OpenStreetMap.Mapnik',
    'OpenStreetMap.BlackAndWhite',
    'OpenTopoMap',
    'Stamen.Terrain',
    'Stamen.TerrainBackground',
    'Stamen.Toner',
    'Stamen.TonerLite',
    'Stamen.TonerBackground',
    'Stamen.Watercolor',
    'No map',
];

const MODAL_CONTENT = {
    help: `
<h1>dérive</h1>
<h4>Drag and drop one or more GPX/TCX/FIT files or JPEG images here.</h4>
<p>If you use Strava, go to your
<a href="https://www.strava.com/athlete/delete_your_account">account download
page</a> and click "Request your archive". You'll get an email containing a ZIP
file of all the GPS tracks you've logged so far. This can take several hours.
</p>

<p>All processing happens in your browser. Your files will not be uploaded or
stored anywhere.</p>

<blockquote>
In a dérive one or more persons during a certain period drop their
relations, their work and leisure activities, and all their other
usual motives for movement and action, and let themselves be drawn by
the attractions of the terrain and the encounters they find there.<cite><a
href="http://library.nothingness.org/articles/SI/en/display/314">[1]</a></cite>
</blockquote>

<p>Code is available <a href="https://github.com/erik/derive">on GitHub</a>.</p>
`,

    exportImage: `
<h3>Export Image</h3>

<form id="export-settings">
    <div class="form-row">
        <label>Format:</label>
        <select name="format">
            <option selected value="png">PNG</option>
            <option value="svg">SVG (no background map)</option>
        </select>
    </div>

    <div class="form-row">
        <label></label>
        <input id="render-export" type="button" value="Render">
    </div>
</form>

<p id="export-output"></p>
`
};

function loadFilesFromServer(map) {
    map.map.panTo([50, 36.15], {noMoveStart: true, animate: true});
    //let modal = buildLoader(files.count);
    const getFileObject  = async (filePathOrUrl) => {
        let xhr = new XMLHttpRequest();
        //xhr.responseType = 'blob';
        xhr.addEventListener('load',  async() => {
            let blob = xhr.response;
            blob.name = filePathOrUrl.replace(/^.*[\\\/]/, '');
            blob.url = filePathOrUrl;
            await handleFile(blob);
        });
        xhr.open('GET', filePathOrUrl, false);
        await xhr.send();
    };

    const handleImage = async file => {
        const image = new Image(file);
        const hasGeolocationData = await image.hasGeolocationData();
        if (!hasGeolocationData) { throw 'No geolocation data'; }
        await map.addImage(image);
    };

    const handleTrackFile = async (file) => {
        for (const track of await extractTracks(file)) {
            track.filename = file.name;
            map.addTrack(track);
        }
    };

    const handleFile = async file => {
        try {
            if (/\.jpe?g$/i.test(file.name)) {
                return await handleImage(file);
            }
            return await handleTrackFile(file);
        } catch (err) {
            //console.error(file, err);
        }
    };

    Promise.all(files['files'].map(getFileObject)).then(value => {
        //modal.finished();
    });
    //load_container.remove();
}

export function buildSettingsModal(tracks, opts, finishCallback) {
    let overrideExisting = opts.lineOptions.overrideExisting ? 'checked' : '';

    if (tracks.length > 0) {
        let allSameColor = tracks.every(({line}) => {
            return line.options.color === tracks[0].line.options.color;
        });

        if (!allSameColor) {
            overrideExisting = false;
        } else {
            opts.lineOptions.color = tracks[0].line.options.color;
        }
    }

    let detect = opts.lineOptions.detectColors ? 'checked' : '';
    let themes = AVAILABLE_THEMES.map(t => {
        let selected = (t === opts.theme) ? 'selected' : '';
        return `<option ${selected} value="${t}">${t}</option>`;
    });

    let modalContent = `
<h3>Options</h3>

<form id="settings">
    <span class="form-row">
        <label>Theme</label>
        <select name="theme">
            ${themes}
        </select>
    </span>

    <fieldset class="form-group">
        <legend>GPS Track Options</legend>

        <div class="row">
            <label>Color</label>
            <input name="color" type="color" value=${opts.lineOptions.color}>
        </div>

        <div class="row">
            <label>Opacity</label>
            <input name="opacity" type="range" min=0 max=1 step=0.01
                value=${opts.lineOptions.opacity}>
        </div>

        <div class="row">
            <label>Width</label>
            <input name="weight" type="number" min=1 max=100
                value=${opts.lineOptions.weight}>
        </div>

    </fieldset>

    <fieldset class="form-group">
        <legend>Image Marker Options</legend>

        <div class="row">
            <label>Color</label>
            <input name="markerColor" type="color" value=${opts.markerOptions.color}>
        </div>

        <div class="row">
            <label>Opacity</label>
            <input name="markerOpacity" type="range" min=0 max=1 step=0.01
                value=${opts.markerOptions.opacity}>
        </div>

        <div class="row">
            <label>Width</label>
            <input name="markerWeight" type="number" min=1 max=100
                value=${opts.markerOptions.weight}>
        </div>

        <div class="row">
            <label>Radius</label>
            <input name="markerRadius" type="number" min=1 max=100
                value=${opts.markerOptions.radius}>
        </div>

    </fieldset>

    <span class="form-row">
        <label>Override existing tracks</label>
        <input name="overrideExisting" type="checkbox" ${overrideExisting}>
    </span>

    <span class="form-row">
        <label>Detect color from Strava bulk export</label>
        <input name="detectColors" type="checkbox" ${detect}>
    </span>
</form>`;

    let modal = picoModal({
        content: modalContent,
        closeButton: true,
        escCloses: true,
        overlayClose: true,
        overlayStyles: (styles) => {
            styles.opacity = 0.1;
        },
    });

    modal.afterClose((modal) => {
        let elements = document.getElementById('settings').elements;
        let options = Object.assign({}, opts);

        for (let opt of ['theme']) {
            options[opt] = elements[opt].value;
        }

        for (let opt of ['color', 'weight', 'opacity']) {
            options.lineOptions[opt] = elements[opt].value;
        }

        for (let opt of ['markerColor', 'markerWeight', 'markerOpacity', 'markerRadius']) {
            let optionName = opt.replace('marker', '').toLowerCase();
            options.markerOptions[optionName] = elements[opt].value;
        }

        for (let opt of ['overrideExisting', 'detectColors']) {
            options.lineOptions[opt] = elements[opt].checked;
        }

        finishCallback(options);
        modal.destroy();
    });

    return modal;
}

export function buildFilterModal(tracks, filters, finishCallback) {
    let maxDate = new Date().toISOString().split('T')[0];
    let modalContent = `
<h3>Filter Displayed Tracks</h3>

<form id="settings">
    <span class="form-row">
        <label for="minDate">Start date:</label>
        <input type="date" id="minDate" name="minDate"
            value="${filters.minDate || ''}"
            min="1990-01-01"
            max="${maxDate}">
    </span>

    <span class="form-row">
        <label for="maxDate">End date:</label>
        <input type="date" id="maxDate" name="maxDate"
            value="${filters.maxDate || ''}"
            min="1990-01-01"
            max="${maxDate}">
    </span>
</form>`;

    let modal = picoModal({
        content: modalContent,
        closeButton: true,
        escCloses: true,
        overlayClose: true,
        overlayStyles: (styles) => {
            styles.opacity = 0.1;
        },
    });

    modal.afterClose((modal) => {
        let elements = document.getElementById('settings').elements;
        let filters = Object.assign({}, filters);

        for (let key of ['minDate', 'maxDate']) {
            filters[key] = elements[key].value;
        }

        finishCallback(filters);
        modal.destroy();
    });

    return modal;
}

export function showModal(type) {
    let modal = picoModal({
        content: MODAL_CONTENT[type],
        overlayStyles: (styles) => {
            styles.opacity = 0.01;
        },
    });

    modal.show();
    return modal;
}


export function initialize(map) {
    loadFilesFromServer(map);
}
