import Dropzone from "dropzone";
var dataUrl;
export async function dropzone(elemntId) {
    const myDropzone = new Dropzone(elemntId, {
        url: "/false",
        maxFiles: 1,
        maxfilesexceeded: function (file) {
            this.removeAllFiles();
            this.addFile(file);
        },
        thumbnailWidth: "250",
        thumbnailHeight: "250",
    });
    await myDropzone.on("thumbnail", async (file) => {
        dataUrl = file.dataURL;
    });
}
export { dataUrl };
