package main

import "time"

const fileName = "tasks.json"

// Constantes para los estados de las tareas
const (
	StatusTodo       = "to-do"
	StatusInProgress = "in-progress"
	StatusDone       = "done"
)

// Task define la estructura de una tarea
type Task struct {
	ID          int       `json:"id"`
	User        string    `json:"user"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
