import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updateData = {};
    if (data.stageId !== undefined) updateData.stageId = data.stageId;
    if (data.motivationScore !== undefined) updateData.motivationScore = parseInt(data.motivationScore);
    if (data.scriptData !== undefined) updateData.scriptData = data.scriptData;

    // If notes are provided, update the contact's notes
    if (data.notes !== undefined) {
      updateData.contact = {
        update: {
          notes: data.notes
        }
      };
    }

    // Property nested update
    if (data.arv !== undefined || data.askingPrice !== undefined) {
      updateData.property = {
        update: {}
      };
      if (data.arv !== undefined) updateData.property.update.arv = parseFloat(data.arv);
      if (data.askingPrice !== undefined) updateData.property.update.askingPrice = parseFloat(data.askingPrice);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: { property: true, contact: true }
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
