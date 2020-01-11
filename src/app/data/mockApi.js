import sampleData from "./sampleData";

const delay = (ms) => {
    return new Promise (resolve => setTimeout(resolve, ms))
}

export const fetchSampleData = () => {
    return delay(1000).then(() => { //the delay itself returns a promise which after resolving in 1second will then go and deal with the nested promise which resolves the sampleData
        return Promise.resolve(sampleData)
    })
}
