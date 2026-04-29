package main

import (
	"fmt"
	"os"
	"strconv"
	"text/tabwriter"
	"time"
)

func addTask(user string, args []string) {
	if len(args) < 1 {
		fmt.Println("Error: Se requiere una descripcion para la tarea.")
		os.Exit(1)
	}
	description := args[0]

	tasks, err := loadTasks()
	if err != nil {
		fmt.Printf("Error al cargar tareas: %v\n", err)
		os.Exit(1)
	}

	// LÓGICA: Buscar el ID más alto solo para este usuario
	newID := 1
	for _, task := range tasks {
		if task.User == user && task.ID >= newID {
			newID = task.ID + 1
		}
	}

	now := time.Now()
	newTask := Task{
		ID:          newID,
		User:        user,
		Description: description,
		Status:      StatusTodo,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	tasks = append(tasks, newTask)

	if err := saveTasks(tasks); err != nil {
		fmt.Printf("Error al guardar la tarea: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Tarea agregada exitosamente para %s (ID: %d)\n", user, newID)
}

func updateTask(user string, args []string) {
	if len(args) < 2 {
		fmt.Println("Error: Se requiere el ID de la tarea y la nueva descripcion.")
		os.Exit(1)
	}

	id, err := strconv.Atoi(args[0])
	if err != nil {
		fmt.Println("Error: El ID debe ser un número entero valido.")
		os.Exit(1)
	}

	newDescription := args[1]

	tasks, err := loadTasks()
	if err != nil {
		fmt.Printf("Error al cargar tareas: %v\n", err)
		os.Exit(1)
	}

	found := false
	for i, task := range tasks {
		if task.ID == id && task.User == user {
			tasks[i].Description = newDescription
			tasks[i].UpdatedAt = time.Now()
			found = true
			break
		}
	}

	if !found {
		fmt.Printf("Error: No se encontro la tarea %d para el usuario '%s'.\n", id, user)
		os.Exit(1)
	}

	if err := saveTasks(tasks); err != nil {
		fmt.Printf("Error al actualizar la tarea: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Tarea %d actualizada exitosamente.\n", id)
}

func deleteTask(user string, args []string) {
	if len(args) < 1 {
		fmt.Println("Error: Se requiere el ID de la tarea a eliminar.")
		os.Exit(1)
	}

	id, err := strconv.Atoi(args[0])
	if err != nil {
		fmt.Println("Error: El ID debe ser un número entero válido.")
		os.Exit(1)
	}

	tasks, err := loadTasks()
	if err != nil {
		fmt.Printf("Error al cargar tareas: %v\n", err)
		os.Exit(1)
	}

	var newTasks []Task
	found := false
	for _, task := range tasks {
		if task.ID == id && task.User == user {
			found = true
			continue
		}
		newTasks = append(newTasks, task)
	}

	if !found {
		fmt.Printf("Error: No se encontró la tarea %d para el usuario '%s'.\n", id, user)
		os.Exit(1)
	}

	if err := saveTasks(newTasks); err != nil {
		fmt.Printf("Error al eliminar la tarea: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Tarea %d eliminada exitosamente.\n", id)
}

func changeStatus(user string, args []string, status string) {
	if len(args) < 1 {
		fmt.Println("Error: Se requiere el ID de la tarea.")
		os.Exit(1)
	}

	id, err := strconv.Atoi(args[0])
	if err != nil {
		fmt.Println("Error: El ID debe ser un número entero válido.")
		os.Exit(1)
	}

	tasks, err := loadTasks()
	if err != nil {
		fmt.Printf("Error al cargar tareas: %v\n", err)
		os.Exit(1)
	}

	found := false
	for i, task := range tasks {
		if task.ID == id && task.User == user {
			tasks[i].Status = status
			tasks[i].UpdatedAt = time.Now()
			found = true
			break
		}
	}

	if !found {
		fmt.Printf("Error: No se encontró la tarea %d para el usuario '%s'.\n", id, user)
		os.Exit(1)
	}

	if err := saveTasks(tasks); err != nil {
		fmt.Printf("Error al actualizar el estado de la tarea: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Tarea %d marcada como '%s'.\n", id, status)
}

func listTasks(user string, args []string) {
	filterStatus := ""
	if len(args) > 0 {
		filterStatus = args[0]
		if filterStatus != StatusTodo && filterStatus != StatusInProgress && filterStatus != StatusDone {
			fmt.Println("Error: Estado de filtrado inválido. Usa: to-do, in-progress o done.")
			os.Exit(1)
		}
	}

	tasks, err := loadTasks()
	if err != nil {
		fmt.Printf("Error al cargar tareas: %v\n", err)
		os.Exit(1)
	}

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 3, ' ', 0)
	fmt.Fprintln(w, "ID\tUSUARIO\tESTADO\tDESCRIPCIÓN\tCREADA\tACTUALIZADA")
	fmt.Fprintln(w, "--\t-------\t------\t-----------\t------\t-----------")

	count := 0
	for _, task := range tasks {
		if task.User == user && (filterStatus == "" || task.Status == filterStatus) {
			fmt.Fprintf(w, "%d\t%s\t%s\t%s\t%s\t%s\n",
				task.ID,
				task.User,
				task.Status,
				task.Description,
				task.CreatedAt.Format("02/01/06 15:04"),
				task.UpdatedAt.Format("02/01/06 15:04"),
			)
			count++
		}
	}
	w.Flush()

	if count == 0 {
		fmt.Printf("\nNo se encontraron tareas para el usuario '%s'.\n", user)
	}
}
