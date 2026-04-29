package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 3 {
		printUsage()
		os.Exit(1)
	}

	user := os.Args[1]
	command := os.Args[2]
	args := os.Args[3:]

	switch command {
	case "add":
		addTask(user, args)
	case "update":
		updateTask(user, args)
	case "delete":
		deleteTask(user, args)
	case "mark-in-progress":
		changeStatus(user, args, StatusInProgress)
	case "mark-done":
		changeStatus(user, args, StatusDone)
	case "list":
		listTasks(user, args)
	default:
		fmt.Printf("Error: Comando desconocido '%s'\n", command)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("Uso: task-tracker <usuario> <comando> [argumentos]")
	fmt.Println("\nComandos disponibles:")
	fmt.Println("  <user> add <descripcion>          - Agrega una nueva tarea")
	fmt.Println("  <user> update <id> <descripcion>  - Actualiza la descripcion de una tarea")
	fmt.Println("  <user> delete <id>                - Elimina una tarea")
	fmt.Println("  <user> mark-in-progress <id>      - Marca una tarea como 'in-progress'")
	fmt.Println("  <user> mark-done <id>             - Marca una tarea como 'done'")
	fmt.Println("  <user> list [state]               - Lista las tareas del usuario (estados opcionales: to-do, in-progress, done)")
}
