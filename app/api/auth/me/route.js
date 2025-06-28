import { verifySession, getUser } from '@/utils/dal';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await verifySession();
    
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Retourner les données utilisateur sans le mot de passe
    const { password_user, ...userWithoutPassword } = user.toJSON();
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
