import { Request, Response } from 'express';
import { NotesService } from './notes.service';
import { handleAsync } from '../../utils/handlers';

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  await handleAsync(req, res, async () => {
    const notes = await NotesService.getNotes(req.user!.$id);
    return { data: notes };
  });
};

export const getNote = async (req: Request, res: Response): Promise<void> => {
  await handleAsync(req, res, async () => {
    const note = await NotesService.getNote(req.params.id, req.user!.$id);
    return { data: note };
  });
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  await handleAsync(
    req,
    res,
    async () => {
      const note = await NotesService.createNote({
        ...req.body,
        userId: req.user!.$id
      });
      return { data: note, status: 201 };
    }
  );
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  await handleAsync(req, res, async () => {
    const note = await NotesService.updateNote(
      req.params.id,
      req.body,
      req.user!.$id
    );
    return { data: note };
  });
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  await handleAsync(req, res, async () => {
    const success = await NotesService.deleteNote(req.params.id, req.user!.$id);
    return { status: success ? 204 : 404 };
  });
}; 