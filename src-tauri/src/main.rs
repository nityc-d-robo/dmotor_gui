// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use motor_lib;
use advanced_pid::{VelPid, PidConfig, PidController};
use rusb::{DeviceHandle, GlobalContext};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct MdStruct {
    address: u8,
    mode: u8,
    phase: u8,
    limsw: u8,
    value: u16
}

#[derive(Debug, Serialize, Deserialize)]
struct BlMdStruct {
    controller_id: u8,
    mode: u8,
    value: i16
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn send_md(/*handle: tauri::State<DeviceHandle<GlobalContext>>, */command: MdStruct) {
    println!("{:?}", command);
}
#[tauri::command]
fn send_blmd(handle: tauri::State<DeviceHandle<GlobalContext>>, pid: tauri::State<Mutex<VelPid>>,command: BlMdStruct) {
    println!("{:?}", command);
    match command.mode {
        2 => motor_lib::blmd::send_current(&handle, command.controller_id, command.value),
        3 => {
            let mut pid = pid.lock().unwrap();
            motor_lib::blmd::send_velocity(&handle, &mut pid, command.controller_id, command.value)
        },
        _ => motor_lib::blmd::receive_status(&handle, command.controller_id),
    };
}

fn main() {
    let handle = motor_lib::init_usb_handle(0x483, 0x5740, 0);
    let config = PidConfig::new(1.0, 0.1, 0.1).with_limits(-16384.0, 16384.0);
    let pid = Mutex::new(VelPid::new(config));

    tauri::Builder::default()
        .manage(handle)
        .manage(pid)
        .invoke_handler(tauri::generate_handler![send_md])
        .invoke_handler(tauri::generate_handler![send_blmd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
