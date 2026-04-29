package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
)

func loadTasks() ([]Task, error) {
	data, err := os.ReadFile(fileName)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			err = saveTasks([]Task{})
			if err != nil {
				return nil, fmt.Errorf("no se pudo crear el archivo inicial: %w", err)
			}
			return []Task{}, nil
		}
		return nil, fmt.Errorf("error leyendo el archivo: %w", err)
	}

	var tasks []Task
	if len(data) == 0 {
		return []Task{}, nil
	}

	if err := json.Unmarshal(data, &tasks); err != nil {
		return nil, fmt.Errorf("el archivo %s está corrupto o tiene formato JSON invalido: %w", fileName, err)
	}

	return tasks, nil
}

func saveTasks(tasks []Task) error {
	data, err := json.MarshalIndent(tasks, "", "  ")
	if err != nil {
		return fmt.Errorf("error formateando a JSON: %w", err)
	}

	if err := os.WriteFile(fileName, data, 0644); err != nil {
		return fmt.Errorf("error escribiendo el archivo: %w", err)
	}

	return nil
}
