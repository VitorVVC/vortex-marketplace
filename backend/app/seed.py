from decimal import Decimal

from sqlalchemy import select

from app.core.security import hash_password
from app.database.database import Base, SessionLocal, engine
from app.models.ad import Ad
from app.models.user import User


def seed_database() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        existing_user = db.scalar(
            select(User).where(
                User.email == "demo@desapegacampus.com",
                )
        )

        if existing_user:
            print("Os dados de demonstração já existem.")
            return

        user = User(
            name="Aluno Demo",
            email="demo@desapegacampus.com",
            password_hash=hash_password("demo1234"),
        )

        db.add(user)
        db.flush()

        ads = [
            Ad(
                title="Calculadora científica Casio",
                description=(
                    "Calculadora em ótimo estado, ideal para disciplinas "
                    "de engenharia e ciências exatas."
                ),
                category="Engenharia",
                price=Decimal("120.00"),
                is_donation=False,
                image_url=(
                    "https://images.unsplash.com/"
                    "photo-1574607383476-f517f260d30b"
                ),
                owner_id=user.id,
            ),
            Ad(
                title="Livro de Cálculo Volume 1",
                description=(
                    "Livro usado com algumas anotações, disponível "
                    "gratuitamente para outro estudante."
                ),
                category="Livros",
                price=None,
                is_donation=True,
                image_url=(
                    "https://images.unsplash.com/"
                    "photo-1544947950-fa07a98d237f"
                ),
                owner_id=user.id,
            ),
            Ad(
                title="Kit Arduino Uno",
                description=(
                    "Kit com placa Arduino, protoboard, cabos e alguns "
                    "sensores para projetos acadêmicos."
                ),
                category="Computação",
                price=Decimal("150.00"),
                is_donation=False,
                image_url=(
                    "https://images.unsplash.com/"
                    "photo-1553406830-ef2513450d76"
                ),
                owner_id=user.id,
            ),
            Ad(
                title="Jaleco branco tamanho M",
                description=(
                    "Jaleco conservado, utilizado durante apenas um semestre."
                ),
                category="Saúde",
                price=Decimal("45.00"),
                is_donation=False,
                image_url=(
                    "https://images.unsplash.com/"
                    "photo-1584982751601-97dcc096659c"
                ),
                owner_id=user.id,
            ),
        ]

        db.add_all(ads)
        db.commit()

        print("Dados de demonstração criados com sucesso.")
        print("E-mail: demo@desapegacampus.com")
        print("Senha: demo1234")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()