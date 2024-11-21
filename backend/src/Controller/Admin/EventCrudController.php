<?php
namespace App\Controller\Admin;

use App\Entity\Event;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\Field;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use Symfony\Component\Validator\Constraints\Image;

class EventCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Event::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('title'),
            TextField::new('description'),
            DateTimeField::new('date_start', 'Start Date'),
            DateTimeField::new('date_end', 'End Date'),
            TextField::new('location', 'Location'),
            BooleanField::new('isVisible', 'Visible')->setRequired(false),
            BooleanField::new('isDraft', 'Draft')->setRequired(false),
            BooleanField::new('isRecommended', 'Recommended')->setRequired(false),
            ImageField::new('image', 'Image (JPG, PNG, WEBP file less than 1MB)')
                ->setBasePath('uploads/events/')
                ->setUploadDir('public/uploads/events')
                ->setFileConstraints(new Image(maxSize: '1M'))
                ->setUploadedFileNamePattern(
                    fn (UploadedFile $file): string => sprintf('%s_%s.%s', date('YmdHis'), uniqid(), $file->guessExtension())
                ),
            AssociationField::new('users')->autocomplete()
        ];
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if(!$entityInstance->isIsVisible()){
            $entityInstance->setIsVisible(false);
        }
        if(!$entityInstance->isIsDraft()){
            $entityInstance->setIsDraft(false);
        }
        if(!$entityInstance->isRecommended()){
            $entityInstance->setIsRecommended(false);
        }

        $entityInstance->setCreator($this->getUser());

        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if(!$entityInstance->isIsVisible()){
            $entityInstance->setIsVisible(false);
        }
        if(!$entityInstance->isIsDraft()){
            $entityInstance->setIsDraft(false);
        }
        if(!$entityInstance->isRecommended()){
            $entityInstance->setIsRecommended(false);
        }
        
        $entityInstance->setCreator($this->getUser());

        parent::updateEntity($entityManager, $entityInstance);
    }
}