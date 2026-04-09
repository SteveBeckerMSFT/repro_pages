"use strict";

const audio_context = new AudioContext();

async function update_permission_status() {
    let permission_status = await navigator.permissions.query({ name: "microphone" });
    console.log(`Permission Status: ${permission_status.state}`);
    if (permission_status.state === "granted") {
        enumerate_devices();
        document.getElementById("request_permission").style.display = "none";
        document.getElementById("audio_output_controls").style.display = "grid";
        document.getElementById("iframe_samples").style.display = "grid";
    } else {
        document.getElementById("request_permission").style.display = "grid";
        document.getElementById("audio_output_controls").style.display = "none";
        document.getElementById("iframe_samples").style.display = "none";
    }
    permission_status.onchange = update_permission_status;
}

function update_set_preferred_sink_id_status() {
    if (!('setPreferredSinkId' in navigator.mediaDevices)) {
        console.error("ERROR: This browser does not support navigator.mediaDevices.setPreferredSinkId()!");
    }
}

async function request_permission() {
    try {
        const media_stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        for (const track of media_stream.getTracks()) {
            track.stop();
        }
    } catch (error) {
        console.error(`ERROR: getUserMedia() failed with: ${error}`);
    }
}

async function set_up_web_audio() {
    try {
        const response = await fetch("ocean-waves-sounds(chosic.com).mp3");
        const compressed_audio = await response.arrayBuffer();
        const uncompressed_audio = await audio_context.decodeAudioData(compressed_audio);

        const source_node = new AudioBufferSourceNode(audio_context, { buffer: uncompressed_audio, loop: true });
        source_node.connect(audio_context.destination);
        source_node.start();
    } catch (error) {
        console.error(`ERROR: web audio setup failed with: ${error}`);
    }
}

async function play_webaudio() {
    audio_context.resume();
}

function pause_web_audio() {
    audio_context.suspend();
}

async function enumerate_devices() {
    try {

        const media_device_list = await navigator.mediaDevices.enumerateDevices();

        const device_switcher_list = [
            "audio_element_sink_id",
            "audio_context_sink_id",
        ];
        if (self === self.top) {
            device_switcher_list.push("preferred_sink_id");
        }
        for (const device_switcher_type of device_switcher_list) {
            const device_switcher = document.getElementById(device_switcher_type);
            device_switcher.replaceChildren();

            const option_element = document.createElement("option");
            option_element.innerHTML = 'Default (empty string)';
            option_element.value = "";
            device_switcher.appendChild(option_element);
        }

        for (const media_device of media_device_list) {
            if (media_device.kind === "audiooutput") {

                for (const device_switcher of device_switcher_list) {
                    const option_element = document.createElement("option");
                    option_element.innerHTML = media_device.label;
                    option_element.value = media_device.deviceId;
                    document.getElementById(device_switcher).appendChild(option_element);
                }
            }
        }
        navigator.mediaDevices.ondevicechange = enumerate_devices;
    } catch (error) {
        console.error(`ERROR: enumerateDevices() failed: ${error}`);
    }
}

async function set_preferred_sink_id(device_label, device_id) {
    try {
        await navigator.mediaDevices.setPreferredSinkId(device_id);
        console.log(`setPreferredSinkId() succeeded with: ${device_label}.`);
        update_audio_element_sink_id();
        update_audio_context_sink_id();
        document.getElementById("preferred_sink_id_value").innerHTML =
            `<b>sinkId:</b> "${trim_sink_id(device_id)}"`;
    } catch (error) {
        console.error(`ERROR: setPreferredSinkId() failed: ${error}`);
    }
}

async function set_audio_element_sink_id(device_label, device_id) {
    try {
        await document.getElementById('audio_element').setSinkId(device_id);
        console.log(`HTMLAudioElement.setSinkId() succeeded with: ${device_label}.`);
        update_audio_element_sink_id();
    } catch (error) {
        console.error(`ERROR: HTMLAudioElement.setSinkId() failed: ${error}`);
    }
}

async function update_audio_element_sink_id() {
    try {
        const sink_id = document.getElementById('audio_element').sinkId;
        document.getElementById("audio_element_sink_id_value").innerHTML =
            `<b>sinkId:</b> "${trim_sink_id(sink_id)}"`;
    } catch (error) {
        console.error(`ERROR: HTMLAudioElement.sinkId failed: ${error}`);
    }
}

async function set_audio_context_sink_id(device_label, device_id) {
    try {
        await audio_context.setSinkId(device_id);
        console.log(`AudioContext succeeded with: ${device_label}.`);
        update_audio_context_sink_id();
    } catch (error) {
        console.error(`ERROR: AudioContext.setSinkId() failed: ${error}`);
    }
}

async function update_audio_context_sink_id() {
    try {
        document.getElementById("audio_context_sink_id_value").innerHTML =
            `<b>sinkId:</b> "${trim_sink_id(audio_context.sinkId)}"`;
    } catch (error) {
        console.error(`ERROR: AudioContext.sinkId failed: ${error}`);
    }
}

function trim_sink_id(sink_id) {
    if (sink_id.length <= 16) {
        return sink_id;
    }
    return `${sink_id.substr(0, 16)}...`;
}

update_set_preferred_sink_id_status();
update_permission_status();

set_up_web_audio();
pause_web_audio();