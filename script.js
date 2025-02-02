function previewImage() {
    let file = document.getElementById("imageInput").files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (event) {
        let img = new Image();
        img.src = event.target.result;

        img.onload = function () {
            document.getElementById("previewImage").src = img.src;
            document.getElementById("previewDimensions").innerText = `Original Dimensions: ${img.width} x ${img.height}`;
            document.getElementById("previewSize").innerText = `File Size: ${(file.size / 1024).toFixed(2)} KB`;
            document.getElementById("preview").style.display = "block";
            document.getElementById("inputs").style.display = "inline";
        };
    };
    reader.readAsDataURL(file);
}

function resizeImage() {
    let file = document.getElementById("imageInput").files[0];
    if (!file) {
        alert("Please select an image");
        return;
    }

    let format = document.getElementById("format").value;
    let width = document.getElementById("width").value || "auto";
    let height = document.getElementById("height").value || "auto";
    let quality = document.getElementById("quality").value || 80;
    let expectedSize = document.getElementById("expectedSize").value; // in KB
    let reader = new FileReader();
    let loader = document.getElementById("loader");
    let output = document.getElementById("output");

    loader.style.display = "block";
    output.style.display = "none";

    reader.onload = function (event) {
        let img = new Image();
        img.src = event.target.result;

        img.onload = function () {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");

            canvas.width = width === "auto" ? img.width : width;
            canvas.height = height === "auto" ? img.height : height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            function adjustQuality(q) {
                return new Promise((resolve) => {
                    canvas.toBlob(
                        (blob) => {
                            resolve({ blob, size: blob.size / 1024 });
                        },
                        `image/${format}`,
                        q / 100
                    );
                });
            }

            async function optimizeImage() {
                let q = quality;
                let result = await adjustQuality(q);
                if (expectedSize) {
                    let targetSize = parseFloat(expectedSize);
                    while (result.size > targetSize && q > 10) {
                        q -= 5;
                        result = await adjustQuality(q);
                    }
                }

                let resizedUrl = URL.createObjectURL(result.blob);
                document.getElementById("resizedImage").src = resizedUrl;
                document.getElementById("dimensions").innerText = `New Dimensions: ${canvas.width} x ${canvas.height}`;
                document.getElementById("size").innerText = `Size: ${result.size.toFixed(2)} KB`;
                document.getElementById("download").href = resizedUrl;
                loader.style.display = "none";
                output.style.display = "block";
            }

            optimizeImage();
        };
    };
    reader.readAsDataURL(file);
}
