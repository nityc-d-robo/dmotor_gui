// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{sync::{Arc, Mutex}, thread, time::Duration};

use motor_lib;
use advanced_pid::{VelPid, PidConfig, PidController};
use rusb::{DeviceHandle, GlobalContext};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct MdStruct {
    address: u8,
    mode: u8,
    limsw: u8,
    value: i16
}

#[derive(Debug, Serialize, Deserialize)]
struct BlMdStruct {
    controller_id: u8,
    mode: u8,
    value: i16
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(async)]
async fn send_md(md_process_manager: tauri::State<'_, Arc<Mutex<[i32; 16]>>>, handle: tauri::State<'_, DeviceHandle<GlobalContext>>, command: MdStruct) -> Result<(), ()>{
    let manager = md_process_manager.clone();
    let mut manager = manager.lock().unwrap();
    manager[command.address as usize]+=1;
    thread::sleep(Duration::from_millis(15));
    match command.mode{
        2 => {
            motor_lib::md::send_pwm(&handle, command.address, command.value);
            manager[command.address as usize]-=1;
        }
        _ => {
            motor_lib::md::receive_status(&handle, command.address);
            manager[command.address as usize]-=1;
        }
    };
    Ok(())
}

#[tauri::command(async)]
async fn send_blmd(blmd_process_manager: tauri::State<'_, Arc<Mutex<[i32; 8]>>>,handle: tauri::State<'_, DeviceHandle<GlobalContext>> ,command: BlMdStruct) -> Result<(),()>{
    let manager = blmd_process_manager.clone();
    let mut manager = manager.lock().unwrap();
    manager[(command.controller_id - 1) as usize]+=1;
    thread::sleep(Duration::from_millis(15));
    match command.mode {
        2 => {
            while manager[(command.controller_id - 1) as usize] == 1{
                motor_lib::blmd::send_current(&handle, command.controller_id, command.value);
            }
            manager[(command.controller_id - 1) as usize]-=1;
        },
        3 => {
            let config = PidConfig::new(1.0, 0.1, 0.1).with_limits(-16384.0, 16384.0);
            let mut pid = VelPid::new(config);
            while manager[(command.controller_id - 1) as usize] == 1{
                println!("{}", command.value);
                motor_lib::blmd::send_velocity(&handle, &mut pid, command.controller_id, command.value);
                thread::sleep(Duration::from_millis(10));
            }
            manager[(command.controller_id - 1) as usize]-=1;
        },
        _ => {
            motor_lib::blmd::receive_status(&handle, command.controller_id);
            manager[(command.controller_id - 1) as usize]-=1;
        },
    };
    Ok(())
}

#[tauri::command]
fn send_emergency(handle: tauri::State<'_, DeviceHandle<GlobalContext>>){
    motor_lib::send_emergency(&handle);
}

fn main() {
    let md_process_manager = Arc::new(Mutex::new([0;16]));
    let blmd_process_manager = Arc::new(Mutex::new([0;8]));
    let handle = motor_lib::init_usb_handle(0x483, 0x5740, 1);

    tauri::Builder::default()
        .manage(md_process_manager)
        .manage(blmd_process_manager)
        .manage(handle)
        .invoke_handler(tauri::generate_handler![
            send_emergency,
            send_md,
            send_blmd
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
