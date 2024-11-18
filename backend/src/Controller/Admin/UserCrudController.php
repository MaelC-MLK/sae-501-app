<?php
namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use EasyCorp\Bundle\EasyAdminBundle\Field\Field;
use Symfony\Component\Validator\Constraints\Image;

class UserCrudController extends AbstractCrudController
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof User && !empty($entityInstance->getPassword())) {
            $entityInstance->setPassword(
                $this->passwordHasher->hashPassword($entityInstance, $entityInstance->getPassword())
            );
        }

        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof User) {
            if (!empty($entityInstance->getPassword())) {
                $entityInstance->setPassword(
                    $this->passwordHasher->hashPassword($entityInstance, $entityInstance->getPassword())
                );
            } else {
                $currentPassword = $entityManager->getUnitOfWork()->getOriginalEntityData($entityInstance)['password'];
                $entityInstance->setPassword($currentPassword);
            }
        }

        parent::updateEntity($entityManager, $entityInstance);
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('email'),
            TextField::new('firstName')->setRequired( false ),
            TextField::new('lastName')->setRequired( false ),
            Field::new( 'password', 'Password' )->onlyWhenCreating()->setRequired( true )
                ->setFormType( RepeatedType::class )
                ->setFormTypeOptions( [
                    'type'            => PasswordType::class,
                    'first_options'   => [ 'label' => 'Password' ],
                    'second_options'  => [ 'label' => 'Repeat password' ],
                    'invalid_message' => 'The password fields do not match.',
                ]),
            Field::new( 'password', 'New password' )->onlyWhenUpdating()->setRequired( false )
                ->setFormType( RepeatedType::class )
                ->setFormTypeOptions( [
                    'type'            => PasswordType::class,
                    'first_options'   => [ 'label' => 'New password' , 'empty_data' => '' ],
                    'second_options'  => [ 'label' => 'Repeat password', 'empty_data' => '' ],
                    'invalid_message' => 'The password fields do not match.',
                ]),
            ChoiceField::new('roles')
                ->setChoices([
                    'Admin' => 'ROLE_ADMIN',
                    'User' => 'ROLE_USER',
                ])
                ->allowMultipleChoices(),
            ImageField::new('avatar', 'Avatar (JPG, PNG, WEBP file less than 1MB)' )
                ->setBasePath('uploads/users/')
                ->setUploadDir('public/uploads/users')
                ->setFileConstraints(new Image(maxSize: '1M'))
                ->setUploadedFileNamePattern(
                    fn (UploadedFile $file): string => sprintf('%s_%s.%s', date('YmdHis'), uniqid(), $file->guessExtension())
                ),
        ];
    }
}