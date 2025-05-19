# 8085 Assembly Compiler

This is a simple web-based compiler for the **Intel 8085 microprocessor** that translates a limited set of **assembly instructions into binary code**. The project was developed as part of a university course on **low-level programming languages**.

🔗 **Live Application**: [8085 Compiler](https://borislav-vucicevic-04.github.io/compiler-8085/)

---

## 🧠 Overview

The application allows users to enter supported 8085 assembly instructions, which are then **compiled into binary**. It features a clean and minimal interface, along with a **help dialog** that guides users through its usage.

---

## ✅ Supported Instructions

The compiler currently supports a subset of 8085 instructions, including:
- `mvi a,05`
- `mvi b,05`
- `mvi c,05`
- `mov a,b`
- `mov a,c`
- `mov b,a`
- `mov b,c`
- `mov c,a`
- `mov c,b`
- `add a`
- `add b`
- `add c`
- `sub a`
- `sub b`
- `sub c`
- `hlt`

Instructions must be entered in lowercase as shown.

---

## 📦 Features

- 🧾 **Assembly to Binary Conversion**  
  Instantly converts supported 8085 assembly instructions into binary code.

- 🆘 **Help Dialog**  
  Provides an in-app guide on how to use the compiler and input instructions.

- ⚙️ **Simple UI**  
  Minimalistic design with focus on functionality and clarity.

---

## 🛠️ Technologies Used

- **TypeScript**
- **React**
- **Hosted on GitHub Pages**

---

## 📚 Educational Purpose

This compiler was built for academic purposes, specifically for a course focused on:
- Low-level programming
- Assembly language
- Program translators (compilers and assemblers)
- 8085 microprocessor architecture

